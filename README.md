# Ferdy

## Open port 443 on Ubuntu without root

    sudo apt-get install libcap2-bin
    sudo setcap "cap_net_bind_service=+ep" /path/to/node

To run redirect, Python needs access to port 80:

    sudo setcap "cap_net_bind_service=+ep" /path/to/python

Shortcut:

    sudo setcap "cap_net_bind_service=+ep" `readlink -f \`which node\``

https://serverfault.com/a/394136
https://stackoverflow.com/a/33113925/13216113
https://serverfault.com/a/731341

## Kill programs using port 443 (or 80)

    sudo ss -lptn "sport = :443"

and use the pid for:

    sudo kill pid

https://unix.stackexchange.com/a/106562

## Get SSL certificates

https://certbot.eff.org/instructions?ws=other&os=ubuntufocal  
https://eff-certbot.readthedocs.io/en/stable/using.html#where-are-my-certificates

Place `fullchain.pem` and `privkey.pem` in this folder
