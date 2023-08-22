isVoteStarted = false
isPlayerAdmin = false
isPlayerVoted = false
winner = nil
local canTextShow = false
local pressedE = false
local candidate

RegisterCommand('deletevote', function(source, args)
    TriggerServerEvent('p-voting:deletevote', vote)
end)

RegisterCommand('createvote', function(source, args)
    TriggerServerEvent('p-voting:createvote')
end)

RegisterNUICallback('candidateNames', function(data, cb)
   cb({})
   local playersVote = data.name
   isPlayerVoted = true
   pressedE = false
   TriggerServerEvent('p-voting:vote', playersVote)
end)

RegisterNUICallback('startVote', function(data, cb)
    cb({})
    isVoteStarted = data.isVoteStarted
    TriggerServerEvent('p-voting:startVoting', true)
end)

RegisterNUICallback('releaseFocus', function()
    SetNuiFocus(false, false)
    pressedE = false
end)

CreateThread(function()
    TriggerServerEvent('p-voting:triggerCheckAdmin')
    RegisterNetEvent('p-voting:checkAdmin', function(playerAdmin)
        isPlayerAdmin = playerAdmin
    end)
end)

CreateThread(function()
    local sleep = 1000
    createBlip(Config.PedCoords.x,Config.PedCoords.y, Config.PedCoords.z, Config.Blip.sprite, Config.Blip.color, Config.Blip.text, Config.Blip.size)
    CreatePedOnCoord(Config.Pedmodel, Config.PedCoords.x,Config.PedCoords.y, Config.PedCoords.z - 1, Config.PedCoords.w)
    while true do 
        Wait(sleep)
        local playerCoords = GetEntityCoords(PlayerPedId())
        local distance = GetDistanceBetweenCoords(playerCoords, Config.PedCoords)
                
        if distance < 5 then 
            canTextShow = true
            
            if isVoteStarted and not isPlayerVoted or isPlayerAdmin then 
                sleep = 0

                if not isPlayerAdmin then
                    if IsControlJustPressed(0, 38) then 
                        canTextShow = false
                        pressedE = true

                        SendNUIMessage({
                            type = "user",
                        })
                        
                        SetNuiFocus(true, true)
                    end
                end

                if isPlayerAdmin then 
                    if IsControlJustPressed(0, 38) then 
                        canTextShow = false
                        pressedE = true

                        SendNUIMessage({
                            type = "admin",
                        })
                        
                        SetNuiFocus(true, true)
                    end
                end  
            elseif not isVoteStarted and not isPlayerAdmin or isPlayerVoted and not isPlayerAdmin then
                SendNUIMessage({
                    type = 'comelater-e',
                })
                sleep = 1000
            end        
        else
            canTextShow = false
            sleep = 1000
        end
    end
end)

CreateThread(function()
    while true do 
        Wait(1000)
        TriggerServerEvent('p-voting:isVoteStarted')
        RegisterNetEvent('p-voting:startVote', function(isVoteStartedServer)
            isVoteStarted = isVoteStartedServer 
        end)
    end
end)

CreateThread(function()
    while true do 
        Wait(1000)
        if canTextShow and not pressedE and isVoteStarted and not isPlayerVoted or isPlayerAdmin then 
            SendNUIMessage({
                type = "press-e"
            })  
        end
        if not canTextShow or pressedE then 
            SendNUIMessage({
                type = 'close-e'
            })
        end
    end
end)

RegisterNUICallback('getWinner', function(data, cb)
    cb({})
    isVoteStarted = false
    TriggerServerEvent('getWinnerServer', isPlayerVoted)

    TriggerServerEvent('voteFalse')

    RegisterNetEvent('setWinner', function(winner)
        win = winner
    end)
end)

RegisterNetEvent('voteFinished', function(isPlayerVotedServer)
    isPlayerVoted = isPlayerVotedServer
end)

RegisterNetEvent('resetVotes', function()
    SendNUIMessage({
        type = 'resetVote'
    })
end)

RegisterNetEvent('setWinner', function(winnr)
    SendNUIMessage({
        type = "winner",
        winner = winnr,
    })
end)

RegisterNUICallback('resetVote', function(data, cb)
    cb({})
    TriggerServerEvent('p-voting:deletevote', vote)
    isPlayerVoted = false
    isVoteStarted = false
    TriggerServerEvent('finishVote')
end)

RegisterNUICallback('createCandidate', function(data, cb)
    cb({})
    local headingC = data.heading
    local detailsC = data.details
    local imgUrlC = data.imgURL
    TriggerServerEvent('sendCandidateServer', headingC, detailsC, imgUrlC)
end)

RegisterNetEvent('sendCandidateClient', function(head, detail, url)
    SendNUIMessage({
        type = 'createDiv',
        headingJS = head,
        detailsJS = detail,
        imgURLJS = url,
    })
end)