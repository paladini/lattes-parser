#!/usr/bin/env sh
# Synthetic fixture only — replace with your exported XML.
set -e
XML="../test/fixtures/curriculum-sample.xml"
npx lattes-parser init .
npx lattes-parser parse "$XML"
npx lattes-parser set "$XML" identification.summary "Resumo editado localmente."
npx lattes-parser backup list .
echo "Re-import $XML manually on the Lattes platform."
