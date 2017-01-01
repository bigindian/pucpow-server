Interface server-side
=====================

Code for the Interface server-side

to import the database
```
mongoimport -d yoloyal -c Outlets --drop outlets.json
mongoimport -d yoloyal -c Chains --drop vh.json
mongoimport -d yoloyal -c Companies --drop comp.json
mongoimport -d yoloyal -c ChainBuckets --drop cb.json
mongoimport -d yoloyal -c _SCHEMA --drop schema.json
```

to export the schema

```
mongoexport -d interface -c _SCHEMA --out _SCHEMA.json

mongoexport -d interface -c JobRoles --out JobRoles.json
mongoexport -d interface -c JobSectors --out JobSectors.json
mongoexport -d interface -c Locations --out Locations.json
mongoexport -d interface -c ProductChannels --out ProductChannels.json
mongoexport -d interface -c ProductNames --out ProductNames.json
mongoexport -d interface -c ServiceNames --out ServiceNames.json
mongoexport -d interface -c BusinessTypes --out BusinessTypes.json
mongoexport -d interface -c ServiceOccupations --out ServiceOccupations.json
```
