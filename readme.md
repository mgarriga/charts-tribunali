#  Tribunali Reports -- SIECIC
## Detalle formato de input .csv
### Nombre y orden de los campos
* nro
* tribunale
* area
* dimensione
* __anno__
* pendenti (formato numerico?)
* pendenti-ultra-triennali
* pendenti-ultra-triennali-perc (percent symbol?)
* iscritti (formato numerico?)
* definiti (formato numerico?)
* durata-media-giorni
* durata-media-anni
* clearance-rate
* magistrati-pianta
* magistrati-presenti
* magistrati-vacanti
* magistrati-tasso-scopertura (percent?)
* personale-pianta
* personale-presenze
* personale-vacanti
* personale-vacanti-perc

### Observaciones
* Agregada la columna __anno__ para diferenciar al colocar todos los datos juntos en la misma hoja
* Eliminar _columnas en blanco_ del documento
* Atención a los nuevos headers!
* Homogeneizar formato, no poner anotaciones que varíen el formato en las columnas (e.g., asteriscos en la columna de tribunale)


## Deployment notes
Tener cuidado con el puerto que se le asigna al container, porque está cableado a localhost:3000 en la vista y se rompe si es otro (configurar?)
