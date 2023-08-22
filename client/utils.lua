function CreatePedOnCoord(pedHash, x, y, z, w)
    
    local pedHashKey = GetHashKey(pedHash)

    RequestModel(pedHashKey)
    while not HasModelLoaded(pedHashKey) do
        Wait(0)
    end

    local ped = CreatePed(0, pedHashKey, x, y, z, w, false, true)

    SetBlockingOfNonTemporaryEvents(ped, true)
    SetPedDiesWhenInjured(ped, false)
    SetPedCanPlayAmbientAnims(ped, true)
    SetPedCanRagdollFromPlayerImpact(ped, false)
    SetEntityInvincible(ped, true)
    FreezeEntityPosition(ped, true)
end

function createBlip(x, y, z, sprite, color, text, size)
    local blip = AddBlipForCoord(x, y, z)
    SetBlipSprite(blip, sprite)
    SetBlipDisplay(blip, 6)
    SetBlipScale(blip, size)
    SetBlipColour(blip, color)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(text)
    EndTextCommandSetBlipName(blip)

    return blip
end