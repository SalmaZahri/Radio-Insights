import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomTableAdmin() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/user/list", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.users);
        } else {
          setData([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des utilisateurs :", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserSelection = (userId, e) => {
    e.stopPropagation();
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Suppression des utilisateurs sélectionnés
  const handleDeleteUsers = () => {
    if (selectedUsers.length === 0) return;

    if (!window.confirm(`Voulez-vous vraiment supprimer ${selectedUsers.length} utilisateur(s) ?`))
      return;

    setIsDeleting(true);

    axios
      .delete("http://localhost:5000/api/user/delete", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: { ids: selectedUsers }, // envoyer tableau d'ids dans body
      })
      .then((res) => {
        if (res.data.success) {
          // Recharger la liste
          fetchUsers();
          // Vider la sélection
          setSelectedUsers([]);
        } else {
          alert("Erreur lors de la suppression.");
        }
        setIsDeleting(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression :", err);
        alert("Erreur lors de la suppression.");
        setIsDeleting(false);
      });
  };

  const filteredData = data.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexLast = page * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentUsers = filteredData.slice(indexFirst, indexLast);

  const Pagination = () => (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        ← Précédent
      </button>
      <span>
        Page {page} sur {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Suivant →
      </button>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border rounded w-64"
        />
        <button
          onClick={handleDeleteUsers}
          disabled={selectedUsers.length === 0 || isDeleting}
          className={`px-4 py-2 rounded text-white ${
            selectedUsers.length === 0 || isDeleting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isDeleting ? "Suppression..." : "Supprimer utilisateur"}
        </button>
      </div>

      <Pagination />

      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-1/6">ID</TableHead>
              <TableHead className="w-1/4">Nom</TableHead>
              <TableHead className="w-1/3">Email</TableHead>
              <TableHead className="w-1/6">isAdmin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 p-3">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
            {currentUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 cursor-pointer">
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => toggleUserSelection(user.id, e)}
                    className="cursor-pointer rounded text-gray-800"
                  />
                </TableCell>
                <TableCell className="w-1/6">{user.id}</TableCell>
                <TableCell className="w-1/4">{user.username}</TableCell>
                <TableCell className="w-1/3">{user.email}</TableCell>
                <TableCell className="w-1/6">{user.is_admin ? "Oui" : "Non"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination />
    </div>
  );
}
