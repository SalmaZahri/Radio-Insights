// src/components/Guide.jsx
import React from "react";
import { BookOpenCheck } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider,SidebarInset } from "@/components/ui/sidebar";

export default function Guide() {
  return (

    <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>

    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpenCheck className="w-8 h-8 text-gray-800 dark:text-gray-200" />
        <h1 className="text-3xl font-bold">Guide de la plateforme RadioInsights</h1>
      </div>

      {/* Introduction */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bienvenue sur RadioInsights</h2>
        <p className="text-gray-700 dark:text-gray-300">
          RadioInsights est une plateforme dédiée à l’analyse et à la gestion des archives radio. Ce guide vous aidera à naviguer et à utiliser les principales fonctionnalités de la plateforme, y compris la visualisation des statistiques, la gestion des archives radio, et la gestion de votre profil utilisateur.
        </p>
      </section>

      {/* Section 1: Navigating the Dashboard */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. Naviguer dans le tableau de bord</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Le tableau de bord est accessible via l’option <strong>Statistiques</strong> dans la barre latérale. Il vous donne un aperçu des données clés et des statistiques de votre activité sur la plateforme.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Cliquez sur <strong>Statistiques</strong> dans la barre latérale pour accéder au tableau de bord.</li>
          <li>Visualisez les métriques importantes, comme le nombre de téléchargements ou les archives consultées.</li>
        </ul>
      </section>

      {/* Section 2: Managing Radio Archives */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. Gérer les archives radio</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Vous pouvez consulter, sélectionner et télécharger des archives radio directement depuis la page principale de la plateforme.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Utilisez la barre de recherche pour trouver une archive spécifique par titre, auteur, ou mot-clé.</li>
          <li>Cochez les cases à côté des archives pour les sélectionner.</li>
          <li>Cliquez sur le bouton <strong>Télécharger la sélection</strong> pour télécharger les archives sélectionnées.</li>
          <li>Cliquez sur une archive pour voir ses détails, écouter un extrait, ou télécharger individuellement via le bouton <strong>Télécharger</strong>.</li>
        </ul>
      </section>

      {/* Section 3: Managing Your Profile */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. Gérer votre profil</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Votre profil utilisateur est accessible depuis la barre latérale, en bas, où votre nom et votre email sont affichés.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Cliquez sur votre nom ou avatar en bas de la barre latérale pour ouvrir le menu de profil.</li>
          <li>Mettez à jour vos informations personnelles, comme votre nom ou email, si nécessaire.</li>
          <li>Déconnectez-vous de la plateforme via l’option de déconnexion dans le menu de profil.</li>
        </ul>
      </section>

      {/* Section 4: Additional Tips */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">4. Astuces supplémentaires</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Voici quelques conseils pour tirer le meilleur parti de RadioInsights :
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Utilisez les filtres de pagination pour naviguer facilement dans les longues listes d’archives.</li>
          <li>Assurez-vous que les fichiers audio sont disponibles sur le serveur pour éviter les erreurs de téléchargement.</li>
          <li>Contactez le support (via l’email de support) si vous rencontrez des problèmes techniques.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 dark:text-gray-400">
        <p>Pour plus d’aide, contactez-nous à support@radioinsights.com.</p>
      </footer>
    </div>

    </SidebarInset>
                </SidebarProvider>
  );
}