#  Tribunali Reports -- SIECIC

## Domande

1. Como se representa el objetivo ultra trienale? es un porcentaje de disminución? es el porcentaje al cual pretenden arribar? Es un numero de casos propuesto por ellos que despues debemos convertir a porcentaje?

## Detalle formato de input .csv
### Nombre y orden de los campos
* nro
* tribunale
* area
* dimensione
* __distretto__
* __regione__
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
* __obiettivo-ultra-triennale__

### Observaciones
* Agregada la columna __anno__ para diferenciar al colocar todos los datos juntos en la misma hoja
* Agregada la columna __obiettivo-ultra-triennali__ inicializada en 10% para todos los tribunales
* Eliminar _columnas en blanco_ del documento
* Atención a los nuevos headers!
* Homogeneizar formato, no poner anotaciones que varíen el formato en las columnas (e.g., asteriscos en la columna de tribunale)
* Ojo con los casilleros en blanco (e.g. napoli nord no ha cargado datos 2013/14). Esto genera __division by zero__ y además un desfasaje en los indicadores triennales

## Deployment notes
Tener cuidado con el puerto que se le asigna al container, porque está cableado a localhost:3000 en la vista y se rompe si es otro (configurar?)
```
$ mongoimport --host  --port  -d tribunali -u -p -c siecic --type csv --file import-siecic2013.csv --headerline
```
## FEEDBACK

3. il CSM ha chiesto di inserire sotto ogni rappresentazione degli indicatori anche i valori assoluti

4.  inserire i 29 distretti di corte d'appello come modalità di aggregazione; si vedano i tribunali articolati per distretto in http://www.giustizia.bari.it/Informazioni_utili_2.aspx

5. Infine chiedo se sia possibile migliorare il layout e inserire anche qualche altro tipo di rappresentazione grafica.
