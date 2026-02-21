#!/bin/bash

# Comprobar que se pasa al menos un argumento (el mensaje de commit)
if [ "$#" -lt 1 ]; then
  echo "Uso: $0 \"Mensaje de commit\""
  exit 1
fi

cd "/home/ice/xIce/Javascript/RaycasterJS/"

git add -A
git commit -m "$1"
git push
