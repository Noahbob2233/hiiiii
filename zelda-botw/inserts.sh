#! /bin/bash

#Ejecuta ./inserts.sh dentro de la carpeta donde se encuentra el fichero
#Si no funciona, ejecuta chmod +x inserts.sh 

mongo zelda-botw --eval "db.dropDatabase()"

for i in *.json; do
	mongoimport --jsonArray -d zelda-botw --file "$i"
done

mongo zelda-botw --eval "db.Usuarios.createIndex( { 'user': 1 }, { unique: true } )"