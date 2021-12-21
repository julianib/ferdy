# run both frontend AND redirect

echo -ne "\033]0;Frontend & Redirect\007"

clear

echo "Sudo required to run frontend and redirect on port 443 and 80"

sudo python ../redirect/main.py & sudo npm start
