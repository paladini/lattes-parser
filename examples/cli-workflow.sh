#!/usr/bin/env sh
# Synthetic fixture only — replace with your exported XML.
set -e
XML="../test/fixtures/curriculum-sample.xml"
npx lattes-toolkit init .
npx lattes-toolkit parse "$XML"
npx lattes-toolkit set "$XML" identification.summary "Resumo editado localmente."
npx lattes-toolkit backup list .
echo "Re-import $XML manually on the Lattes platform."
