echo -ne "\033]0;Redirect\007"

clear
echo "Sudo required to start redirect on port 80"
sudo python main.py
