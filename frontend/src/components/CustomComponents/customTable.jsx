import React, { useEffect, useState } from "react";
import WaveSurferPlayer from './WaveSurferPlayer';

export default function CustomTable() {
  // États
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [radiosPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [selectedRadios, setSelectedRadios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des données
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/radios")
      .then((res) => res.json())
      .then((json) => {
        console.log("Données chargées :", json);
        setData(json);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des données :", err);
        setIsLoading(false);
      });
  }, []);

  // Gestion des checkboxes
  const toggleRadioSelection = (radioId, e) => {
    e.stopPropagation();
    console.log("Toggle radio ID:", radioId);
    console.log("État avant toggle:", selectedRadios);
    setSelectedRadios((prev) => {
      const newSelection = prev.includes(radioId)
        ? prev.filter((id) => id !== radioId)
        : [...prev, radioId];
      console.log("État après toggle:", newSelection);
      return newSelection;
    });
  };

  // Filtrage et pagination
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / radiosPerPage);
  const indexLast = page * radiosPerPage;
  const indexFirst = indexLast - radiosPerPage;
  const currentRadios = filteredData.slice(indexFirst, indexLast);

  // Affichage détaillé
  const handleRowClick = async (radio) => {
  setSelectedRadio(radio);

  const token = localStorage.getItem("token"); // ou sessionStorage

  if (!token) {
    console.warn("Utilisateur non authentifié.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/radios-views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token dans l'entête
      },
      body: JSON.stringify({ radioId: radio.id }), // on envoie uniquement radioId
    });

    if (!response.ok) {
      console.error("Erreur lors de l'enregistrement de la vue :", await response.text());
    } else {
      console.log("Vue enregistrée avec succès !");
    }
  } catch (err) {
    console.error("Erreur réseau lors de l'enregistrement de la vue :", err);
  }
};



  const handleBackToList = () => {
    setSelectedRadio(null);
  };

  const displayValue = (value) => {
    return value === null || value === "NULL" ? "Non disponible" : value;
  };

  // Pagination
  const Pagination = () => (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        className="px-4 py-2 border rounded-md disabled:opacity-50 transition-colors duration-200 hover:bg-gray-100"
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
      >
        ← Précédent
      </button>
      <span className="text-sm text-gray-600">
        Page {page} sur {totalPages}
      </span>
      <button
        className="px-4 py-2 border rounded-md disabled:opacity-50 transition-colors duration-200 hover:bg-gray-100"
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
      >
        Suivant →
      </button>
    </div>
  );

  // Gestion des fichiers audio
  const availableAudioFiles = [
    "001a231d.wav.mp3", "001a26a1.wav.mp3", "001a26c6.wav.mp3", 
    "001a26fc.wav.mp3", "001a2b91.wav.mp3", "001a38fc.wav.mp3", 
    "001a6d65.wav.mp3", "001a9d68.wav.mp3", "001a9d8f.wav.mp3", 
    "0042a078.wav.mp3", "0042f4a5.wav.mp3", "0A4AF06C.wav.mp3", 
    "0AA83AD1.wav.mp3"
  ];

  const getAudioUrl = (radio) => {
    if (!radio) {
      console.warn("Radio object is null or undefined");
      return null;
    }

    const backendUrl = "http://localhost:5000";
    const fileExists = (filename) => availableAudioFiles.includes(filename);

    console.log("Radio object being processed:", radio);

    if (radio.title_id && radio.title_id !== "NULL") {
      const filename = `${radio.title_id}.wav.mp3`;
      console.log(`Trying to match title_id: ${radio.title_id} -> ${filename}`);
      if (fileExists(filename)) {
        const audioUrl = `${backendUrl}/uploads/${filename}`;
        console.log(`Match found for title_id ${radio.title_id}: ${audioUrl}`);
        return audioUrl;
      } else {
        console.log(`No match for title_id ${radio.title_id} in availableAudioFiles`);
      }
    } else {
      console.log("title_id is missing or NULL");
    }

    if (radio.soundfile_name && radio.soundfile_name !== "NULL") {
      let baseName = radio.soundfile_name.split('/').pop().split('\\').pop();
      baseName = baseName.replace(/\.[^/.]+$/, '');
      const filename = `${baseName}.wav.mp3`;
      console.log(`Trying to match soundfile_name: ${radio.soundfile_name} -> ${filename}`);
      if (fileExists(filename)) {
        const audioUrl = `${backendUrl}/uploads/${filename}`;
        console.log(`Match found for soundfile_name ${radio.soundfile_name}: ${audioUrl}`);
        return audioUrl;
      } else {
        console.log(`No match for soundfile_name ${radio.soundfile_name} in availableAudioFiles`);
      }
    } else {
      console.log("soundfile_name is missing or NULL");
    }

    if (radio.title && radio.title !== "NULL") {
      const titleLower = radio.title.toLowerCase();
      console.log(`Trying to match title: ${titleLower}`);
      for (const availableFile of availableAudioFiles) {
        const fileWithoutExt = availableFile.replace(/\.wav\.mp3$/, '').toLowerCase();
        if (titleLower === fileWithoutExt) {
          const audioUrl = `${backendUrl}/uploads/${availableFile}`;
          console.log(`Exact match found for title ${radio.title}: ${audioUrl}`);
          return audioUrl;
        }
      }
      console.log(`No exact match for title ${radio.title} in availableAudioFiles`);
    } else {
      console.log("title is missing or NULL");
    }

    console.warn(`No audio file found for radio: ${radio.title || "unknown"}. Skipping download.`);
    return null;
  };

  const handleDownloadSelected = () => {
    if (selectedRadios.length === 0) {
      console.warn("Aucune radio sélectionnée pour le téléchargement.");
      return;
    }

    console.log("Selected Radios IDs:", selectedRadios);
    console.log("Current data:", data);

    selectedRadios.forEach((radioId, index) => {
      setTimeout(() => {
        console.log(`Processing download ${index + 1}/${selectedRadios.length} for radio ID: ${radioId}`);

        const radioIndex = currentRadios.findIndex((r, idx) => {
          const uniqueId = r.id !== undefined ? r.id : `index-${indexFirst + idx}`;
          return uniqueId === radioId;
        });

        if (radioIndex === -1) {
          console.error(`Radio with ID ${radioId} not found in currentRadios.`);
          return;
        }

        const radio = currentRadios[radioIndex];
        console.log(`Found radio for ID ${radioId}:`, radio);

        const audioUrl = getAudioUrl(radio);
        if (!audioUrl) {
          console.warn(`Aucun fichier audio trouvé pour la radio: ${radio.title || "unknown"}. Skipping download.`);
          return;
        }

        console.log(`Initiating download for ${radio.title || "unknown"}: ${audioUrl}`);
        try {
          fetch(audioUrl, { method: 'HEAD' })
            .then((response) => {
              if (response.ok) {
                console.log(`Audio URL is accessible: ${audioUrl}`);
                const link = document.createElement("a");
                link.href = audioUrl;
                link.download = audioUrl.split("/").pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log(`Download triggered for ${radio.title || "unknown"}`);
              } else {
                console.error(`Audio URL is not accessible: ${audioUrl}. Status: ${response.status}`);
              }
            })
            .catch((error) => {
              console.error(`Erreur lors de la vérification de l'URL ${audioUrl}:`, error);
            });
        } catch (error) {
          console.error(`Erreur lors du téléchargement de ${radio.title || "unknown"}:`, error);
        }
      }, index * 1000);
    });
  };

  const handleDownloadSingle = (radio) => {
    const audioUrl = getAudioUrl(radio);
    if (!audioUrl) {
      console.warn(`Aucun fichier audio trouvé pour la radio: ${radio.title || "unknown"}. Skipping download.`);
      return;
    }

    console.log(`Initiating single download for ${radio.title || "unknown"}: ${audioUrl}`);
    try {
      fetch(audioUrl, { method: 'HEAD' })
        .then((response) => {
          if (response.ok) {
            console.log(`Audio URL is accessible: ${audioUrl}`);
            const link = document.createElement("a");
            link.href = audioUrl;
            link.download = audioUrl.split("/").pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Download triggered for ${radio.title || "unknown"}`);
          } else {
            console.error(`Audio URL is not accessible: ${audioUrl}. Status: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error(`Erreur lors de la vérification de l'URL ${audioUrl}:`, error);
        });
    } catch (error) {
      console.error(`Erreur lors du téléchargement de ${radio.title || "unknown"}:`, error);
    }
  };

  // Affichage
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {!selectedRadio ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher une archive radio..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-96 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
            />
            
            <button
              onClick={handleDownloadSelected}
              disabled={selectedRadios.length === 0}
              className={`
                w-full md:w-auto px-6 py-2.5 
                bg-gray-800 text-white 
                font-semibold text-sm uppercase tracking-wide 
                rounded-lg shadow-md 
                hover:bg-gray-900 
                focus:outline-none focus:ring-4 focus:ring-gray-300 
                disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-300 ease-in-out transform 
                hover:-translate-y-0.5 hover:shadow-lg
              `}
            >
              Télécharger la sélection ({selectedRadios.length})
            </button>
          </div>

          <Pagination />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 border-b text-left w-12"></th>
               
                  <th className="p-3 border-b text-left w-32"></th>
                  <th className="p-3 border-b text-left">Titre</th>
                </tr>
              </thead>
              <tbody>
                {currentRadios.map((radio, index) => {
                  const uniqueId = radio.id !== undefined ? radio.id : `index-${indexFirst + index}`;
                  return (
                    <tr 
                      key={uniqueId}
                      onClick={() => handleRowClick(radio)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    >
                      <td 
                        className="p-3 border-b"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRadios.includes(uniqueId)}
                          onChange={(e) => toggleRadioSelection(uniqueId, e)}
                          className="w-5 h-5 cursor-pointer rounded text-gray-800 focus:ring-gray-500"
                        />
                      </td>
                    
                      <td className="p-3 border-b">
                        <img
                          src={radio.cover ? `http://localhost:5000${radio.cover}` : "http://localhost:5000/radiosImg.png"}
                          alt="Cover"
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = "http://localhost:5000/radiosImg.png";
                          }}
                        />
                      </td>
                      <td className="p-3 border-b font-medium">
                        <div className="flex flex-col">
                          <span>{displayValue(radio.title)}</span>
                          {radio.author && (
                            <span className="text-sm text-gray-500">{displayValue(radio.author)}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination />
        </>
      ) : (
        <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
          <button 
            onClick={handleBackToList}
            className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Retour à la liste
          </button>
          
          <div className="mt-6 flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={selectedRadio.cover ? `http://localhost:5000${selectedRadio.cover}` : "http://localhost:5000/radiosImg.png"}
                alt="Cover"
                className="w-48 h-48 rounded-lg object-cover shadow-md"
              />
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => handleDownloadSingle(selectedRadio)}
                  className={`
                    px-6 py-2.5 
                    bg-gray-700 text-white 
                    font-semibold text-sm uppercase tracking-wide 
                    rounded-lg shadow-md 
                    hover:bg-gray-800 
                    focus:outline-none focus:ring-4 focus:ring-gray-300 
                    transition-all duration-300 ease-in-out transform 
                    hover:-translate-y-0.5 hover:shadow-lg
                  `}
                >
                  Télécharger
                </button>
              </div>
            </div>

            <div className="flex-1">
              <WaveSurferPlayer audioUrl={getAudioUrl(selectedRadio)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <DetailItem label="Titre" value={displayValue(selectedRadio.title)} />
                <DetailItem label="Auteur" value={displayValue(selectedRadio.author)} />
                <DetailItem label="Durée (ms)" value={displayValue(selectedRadio.duree)} />
                <DetailItem label="En ligne" value={displayValue(selectedRadio.is_online)} />
                <DetailItem label="Date d'enregistrement" value={displayValue(selectedRadio.record_date)} />
                <DetailItem label="Dernière modification" value={displayValue(selectedRadio.last_modif_time)} />
                <DetailItem label="Interprète" value={displayValue(selectedRadio.interpret)} />
                <DetailItem label="Mots-clés" value={displayValue(selectedRadio.keywords)} />
                <DetailItem label="Société" value={displayValue(selectedRadio.compagny_disp_name)} />
                <DetailItem label="Album" value={displayValue(selectedRadio.album_disp_name)} />
                <DetailItem label="Commentaire 1" value={displayValue(selectedRadio.commentaire1)} />
                <DetailItem label="Commentaire 2" value={displayValue(selectedRadio.commentaire2)} />
                <DetailItem label="Classe" value={displayValue(selectedRadio.class_name)} />
                <DetailItem label="Acteur" value={displayValue(selectedRadio.act)} />
                <DetailItem label="Compositeur" value={displayValue(selectedRadio.composer)} />
                <DetailItem label="Créateur" value={displayValue(selectedRadio.creator)} />
                <DetailItem label="Personnalisé 1" value={displayValue(selectedRadio.custom1)} />
                <DetailItem label="Personnalisé 2" value={displayValue(selectedRadio.custom2)} />
                <DetailItem label="Référence" value={displayValue(selectedRadio.label_reference)} />
                <DetailItem label="Œuvre" value={displayValue(selectedRadio.oeuvre)} />
                <DetailItem label="Orchestre" value={displayValue(selectedRadio.orchestra)} />
                <DetailItem label="Chef d'orchestre" value={displayValue(selectedRadio.conductor)} />
                <DetailItem label="Langue" value={displayValue(selectedRadio.language)} />
                <DetailItem label="Voix" value={displayValue(selectedRadio.voice)} />
                <DetailItem label="Période" value={displayValue(selectedRadio.period)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour afficher les détails
function DetailItem({ label, value }) {
  return (
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}