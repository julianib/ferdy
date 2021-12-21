# start frontend without also running redirect

echo -ne "\033]0;Frontend\007"

clear

echo "Sudo required to start frontend on port 443 or 80"

sudo npm start
