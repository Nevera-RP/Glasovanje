fx_version 'cerulean'
game 'gta5'
lua54 'yes'
author 'worspe && turshu'
description 'Voting by precious discord.gg/6sARV4Asqv'

client_scripts {
    'client/main.lua',
    'client/utils.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/utils.lua',
}

shared_scripts {
    'config.lua',
}

ui_page 'nui/index.html' 

files {
    'nui/index.html',
    'nui/script.js',
    'nui/style.css',
    'nui/images/*',
}