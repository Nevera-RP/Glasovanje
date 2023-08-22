local isVoteStartedServer = false
local heading
local details
local imgUrl

RegisterNetEvent('finishVote',function()
  isVoteStartedServer = false
end)

RegisterNetEvent('p-voting:vote', function(vote)

    local voterId = GetPlayerIdentifier(source, 0)

    mysqlQuery('INSERT INTO votes (voterId, vote) VALUES (?, ?)', {
        voterId, vote
    }, function()
    end)
end)

RegisterNetEvent('p-voting:deletevote', function()
    local src = source
    mysqlQuery('TRUNCATE TABLE votes')
    
    TriggerClientEvent('resetVotes', -1)
end)


RegisterNetEvent('voteFalse', function()
  isVoteStartedServer = false
end)

RegisterNetEvent('p-voting:startVoting', function()
  isVoteStartedServer = true
end)

RegisterNetEvent('p-voting:isVoteStarted', function()
  TriggerClientEvent('p-voting:startVote', -1, isVoteStartedServer)
end)

RegisterNetEvent('p-voting:triggerCheckAdmin', function()
  local src = source
  local playerAdmin = false
  local discordId
  for k,v in pairs(GetPlayerIdentifiers(src))  do
    if string.sub(v, 1, string.len("discord:")) == "discord:" then
      discordId = v
    end
  end

  for a, adminIds in pairs (Config.AdminsDiscordID) do  
    if discordId == adminIds then 
      playerAdmin = true
    end
  end
  TriggerClientEvent('p-voting:checkAdmin', src, playerAdmin)
end)


RegisterNetEvent('getWinnerServer', function(isPlayerVoted)
    local src = source
    isPlayerVoted = isPlayerVotedServer
    isPlayerVotedServer = false
    winner = MySQL.scalar.await('SELECT vote, COUNT(vote) as winner FROM votes GROUP BY vote ORDER BY COUNT(vote) DESC LIMIT 1')

    TriggerClientEvent('setWinner', src, winner)

    TriggerClientEvent('voteFinished', -1, isPlayerVotedServer)
end)

RegisterNetEvent('sendCandidateServer', function(heading, details, imgUrl)
  local src = source

  TriggerClientEvent('sendCandidateClient', -1, heading, details, imgUrl)
end)