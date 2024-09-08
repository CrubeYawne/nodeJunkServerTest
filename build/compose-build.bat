call date-clean.bat

set projectname=%1%

cd ..
call build/git-data .bat
docker compose build
docker compose up -d
docker tag %projectname%-server %projectname%-server:%cleandate%

cd build
mkdir images
docker save --output images/%projectname%-server-%cleandate%.tar %projectname%-server:%cleandate%
