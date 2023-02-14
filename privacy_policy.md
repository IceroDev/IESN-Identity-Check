# Utilisation et stockage des données de Identity Checker

## Hébergement des données
L'hébergement des composants de Identity Checker sont hébergés sous containers Docker sur un serveur chez Oracle Cloud à Paris au datacenter eu-paris-1 
Les composants sont :
- Un serveur MariaDB
- Une application NodeJS intégrée à Discord

Les applications fonctionnent sous un réseau privé qui leur est commun. Il est impossible pour l'extérieur de faire des requêtes vers le serveur MariaDB.

## Informations collectées
- ID Discord
- Adresse email associée à votre compte Henallux

## Sécurité des données
Pour garantir la sécurité de la base de données, les backups sont chiffrées avec le cipher AES512.  
L'intégration Discord Identity Checker ne peut pas lire le contenu de vos messages et ne peut pas analyser votre activité Discord. Vous pouvez vérifier les permissions de l'application en cliquant sur son pseudo et en cliquant sur "Accès aux données"

## Demander la suppression des données
Il est possible de supprimer les données que Identity Checker à sur vous (répertoriées sur le point 2 (Informations collectées). Il vous suffit de faire la commande /delete pour supprimer les données concernant votre compte.  
⚠️ ATTENTION ! Cela retirera votre compte des comptes autorisés à accéder à IESN Squad
