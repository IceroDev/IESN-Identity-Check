# IESN-Identity-Check
## Requis
- NodeJS 16.18.1
- MariaDB 10.9.4

## Requête de création de la table users
```
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, id_discord varchar(50), code VARCHAR(10), mail VARCHAR(100), date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
```

## Contribuer 
L'application est en constante évolution, n'hésitez pas à proposer vos mises à jour en faisant une pull request.
