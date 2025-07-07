// Enhanced demo scripts for when AI is not configured
export const demoScripts: Record<string, string> = {
  weapon: `-- Advanced Weapon System
-- Place this script in ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local SoundService = game:GetService("SoundService")

-- Create RemoteEvents folder
local weaponEvents = Instance.new("Folder")
weaponEvents.Name = "WeaponEvents"
weaponEvents.Parent = ReplicatedStorage

local fireEvent = Instance.new("RemoteEvent")
fireEvent.Name = "FireWeapon"
fireEvent.Parent = weaponEvents

local reloadEvent = Instance.new("RemoteEvent")
reloadEvent.Name = "ReloadWeapon"
reloadEvent.Parent = weaponEvents

-- Weapon Configuration
local WeaponConfig = {
    damage = 25,
    fireRate = 0.1, -- Time between shots
    maxAmmo = 30,
    reloadTime = 2.5,
    range = 500,
    spread = 0.1, -- Bullet spread
    headshotMultiplier = 2.0
}

-- Player weapon data
local playerWeapons = {}

-- Initialize player weapon data
local function initializePlayer(player)
    playerWeapons[player.UserId] = {
        ammo = WeaponConfig.maxAmmo,
        lastFired = 0,
        reloading = false
    }
end

-- Handle weapon firing
fireEvent.OnServerEvent:Connect(function(player, targetPosition, hitPart)
    local character = player.Character
    if not character or not character:FindFirstChild("HumanoidRootPart") then return end
    
    local weaponData = playerWeapons[player.UserId]
    if not weaponData then
        initializePlayer(player)
        weaponData = playerWeapons[player.UserId]
    end
    
    -- Check fire rate
    local currentTime = tick()
    if currentTime - weaponData.lastFired < WeaponConfig.fireRate then
        return
    end
    
    -- Check ammo
    if weaponData.ammo <= 0 or weaponData.reloading then
        return
    end
    
    -- Update last fired time and ammo
    weaponData.lastFired = currentTime
    weaponData.ammo = weaponData.ammo - 1
    
    -- Create raycast
    local rayOrigin = character.HumanoidRootPart.Position
    local rayDirection = (targetPosition - rayOrigin).Unit * WeaponConfig.range
    
    -- Add spread
    local spreadX = (math.random() - 0.5) * WeaponConfig.spread
    local spreadY = (math.random() - 0.5) * WeaponConfig.spread
    rayDirection = rayDirection + Vector3.new(spreadX, spreadY, 0)
    
    local raycastParams = RaycastParams.new()
    raycastParams.FilterType = Enum.RaycastFilterType.Blacklist
    raycastParams.FilterDescendantsInstances = {character}
    
    local raycastResult = workspace:Raycast(rayOrigin, rayDirection, raycastParams)
    
    if raycastResult then
        local hitCharacter = raycastResult.Instance.Parent
        local humanoid = hitCharacter:FindFirstChild("Humanoid")
        
        if humanoid and hitCharacter ~= character then
            local damage = WeaponConfig.damage
            
            -- Check for headshot
            if raycastResult.Instance.Name == "Head" then
                damage = damage * WeaponConfig.headshotMultiplier
                print("HEADSHOT! " .. player.Name .. " hit " .. hitCharacter.Name)
            end
            
            humanoid:TakeDamage(damage)
            print(player.Name .. " hit " .. hitCharacter.Name .. " for " .. damage .. " damage")
        end
    end
    
    print(player.Name .. " fired weapon. Ammo remaining: " .. weaponData.ammo)
end)

-- Handle weapon reloading
reloadEvent.OnServerEvent:Connect(function(player)
    local weaponData = playerWeapons[player.UserId]
    if not weaponData or weaponData.reloading then return end
    
    weaponData.reloading = true
    print(player.Name .. " is reloading...")
    
    wait(WeaponConfig.reloadTime)
    
    weaponData.ammo = WeaponConfig.maxAmmo
    weaponData.reloading = false
    
    print(player.Name .. " finished reloading!")
end)

-- Initialize players
Players.PlayerAdded:Connect(initializePlayer)

for _, player in pairs(Players:GetPlayers()) do
    initializePlayer(player)
end

-- Cleanup on player leave
Players.PlayerRemoving:Connect(function(player)
    playerWeapons[player.UserId] = nil
end)

print("Advanced Weapon System loaded successfully!")`,

  npc: `-- Intelligent NPC System
-- Place this script in ServerScriptService

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local PathfindingService = game:GetService("PathfindingService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Create RemoteEvents
local npcEvents = Instance.new("Folder")
npcEvents.Name = "NPCEvents"
npcEvents.Parent = ReplicatedStorage

local dialogEvent = Instance.new("RemoteEvent")
dialogEvent.Name = "NPCDialog"
dialogEvent.Parent = npcEvents

-- NPC Configuration
local NPC_CONFIG = {
    name = "QuestMaster",
    followDistance = 15,
    stopDistance = 5,
    walkSpeed = 8,
    dialogues = {
        "Greetings, adventurer! I have a quest for you!",
        "The ancient temple needs exploring. Are you brave enough?",
        "Collect 10 crystals and return to me for a reward!",
        "Beware of the monsters in the dark caves!"
    },
    questItems = {"Crystal", "Gem", "Artifact"},
    rewardGold = 100
}

-- Create NPC Model
local function createNPC()
    local npc = Instance.new("Model")
    npc.Name = NPC_CONFIG.name
    npc.Parent = workspace
    
    -- Create Humanoid
    local humanoid = Instance.new("Humanoid")
    humanoid.MaxHealth = 100
    humanoid.Health = 100
    humanoid.WalkSpeed = NPC_CONFIG.walkSpeed
    humanoid.Parent = npc
    
    -- Create Body Parts
    local head = Instance.new("Part")
    head.Name = "Head"
    head.Size = Vector3.new(2, 1, 1)
    head.BrickColor = BrickColor.new("Light orange")
    head.TopSurface = Enum.SurfaceType.Smooth
    head.BottomSurface = Enum.SurfaceType.Smooth
    head.Parent = npc
    
    local torso = Instance.new("Part")
    torso.Name = "Torso"
    torso.Size = Vector3.new(2, 2, 1)
    torso.BrickColor = BrickColor.new("Bright blue")
    torso.TopSurface = Enum.SurfaceType.Smooth
    torso.BottomSurface = Enum.SurfaceType.Smooth
    torso.Parent = npc
    
    -- Create HumanoidRootPart
    local humanoidRootPart = Instance.new("Part")
    humanoidRootPart.Name = "HumanoidRootPart"
    humanoidRootPart.Size = Vector3.new(2, 2, 1)
    humanoidRootPart.Transparency = 1
    humanoidRootPart.CanCollide = false
    humanoidRootPart.Parent = npc
    
    -- Create Joints
    local neck = Instance.new("Motor6D")
    neck.Name = "Neck"
    neck.Part0 = torso
    neck.Part1 = head
    neck.C0 = CFrame.new(0, 1, 0)
    neck.C1 = CFrame.new(0, -0.5, 0)
    neck.Parent = torso
    
    local rootJoint = Instance.new("Motor6D")
    rootJoint.Name = "RootJoint"
    rootJoint.Part0 = humanoidRootPart
    rootJoint.Part1 = torso
    rootJoint.Parent = humanoidRootPart
    
    -- Add ClickDetector for interaction
    local clickDetector = Instance.new("ClickDetector")
    clickDetector.MaxActivationDistance = 10
    clickDetector.Parent = head
    
    -- Add name tag
    local billboardGui = Instance.new("BillboardGui")
    billboardGui.Size = UDim2.new(0, 100, 0, 50)
    billboardGui.StudsOffset = Vector3.new(0, 3, 0)
    billboardGui.Parent = head
    
    local nameLabel = Instance.new("TextLabel")
    nameLabel.Size = UDim2.new(1, 0, 1, 0)
    nameLabel.BackgroundTransparency = 1
    nameLabel.Text = NPC_CONFIG.name
    nameLabel.TextColor3 = Color3.new(1, 1, 1)
    nameLabel.TextScaled = true
    nameLabel.Font = Enum.Font.SourceSansBold
    nameLabel.Parent = billboardGui
    
    -- Position NPC
    npc:SetPrimaryPartCFrame(CFrame.new(0, 5, 0))
    
    return npc, clickDetector
end

-- NPC AI Variables
local npc, clickDetector = createNPC()
local humanoid = npc:WaitForChild("Humanoid")
local currentTarget = nil
local lastDialogTime = 0
local isMoving = false

-- Pathfinding function
local function moveToPosition(targetPosition)
    if isMoving then return end
    
    isMoving = true
    local path = PathfindingService:CreatePath({
        AgentRadius = 2,
        AgentHeight = 5,
        AgentCanJump = true,
        WaypointSpacing = 4
    })
    
    local success, errorMessage = pcall(function()
        path:ComputeAsync(npc.HumanoidRootPart.Position, targetPosition)
    end)
    
    if success and path.Status == Enum.PathStatus.Success then
        local waypoints = path:GetWaypoints()
        
        for i, waypoint in pairs(waypoints) do
            if waypoint.Action == Enum.PathWaypointAction.Jump then
                humanoid.Jump = true
            end
            humanoid:MoveTo(waypoint.Position)
            humanoid.MoveToFinished:Wait()
        end
    else
        -- Fallback to direct movement
        humanoid:MoveTo(targetPosition)
    end
    
    isMoving = false
end

-- Find nearest player
local function findNearestPlayer()
    local nearestPlayer = nil
    local shortestDistance = math.huge
    
    for _, player in pairs(Players:GetPlayers()) do
        if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
            local distance = (player.Character.HumanoidRootPart.Position - npc.HumanoidRootPart.Position).Magnitude
            if distance < shortestDistance then
                shortestDistance = distance
                nearestPlayer = player
            end
        end
    end
    
    return nearestPlayer, shortestDistance
end

-- NPC Behavior Loop
RunService.Heartbeat:Connect(function()
    local nearestPlayer, distance = findNearestPlayer()
    
    if nearestPlayer and distance > NPC_CONFIG.stopDistance and distance < NPC_CONFIG.followDistance then
        if not isMoving then
            currentTarget = nearestPlayer
            spawn(function()
                moveToPosition(nearestPlayer.Character.HumanoidRootPart.Position)
            end)
        end
    elseif distance and distance <= NPC_CONFIG.stopDistance then
        humanoid:MoveTo(npc.HumanoidRootPart.Position) -- Stop moving
    end
end)

-- Handle NPC interaction
clickDetector.MouseClick:Connect(function(player)
    local currentTime = tick()
    if currentTime - lastDialogTime < 2 then return end -- Prevent spam
    
    lastDialogTime = currentTime
    local randomDialog = NPC_CONFIG.dialogues[math.random(1, #NPC_CONFIG.dialogues)]
    
    dialogEvent:FireClient(player, NPC_CONFIG.name, randomDialog)
    print(NPC_CONFIG.name .. " says to " .. player.Name .. ": " .. randomDialog)
end)

-- Handle dialog responses (if needed)
dialogEvent.OnServerEvent:Connect(function(player, response)
    print(player.Name .. " responded: " .. tostring(response))
    -- Add quest logic here
end)

print("Intelligent NPC System loaded successfully!")`,

  teleport: `-- Advanced Teleportation Hub
-- Place this script in ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

-- Create RemoteEvents
local teleportEvents = Instance.new("Folder")
teleportEvents.Name = "TeleportEvents"
teleportEvents.Parent = ReplicatedStorage

local teleportEvent = Instance.new("RemoteEvent")
teleportEvent.Name = "TeleportPlayer"
teleportEvent.Parent = teleportEvents

local teleportGuiEvent = Instance.new("RemoteEvent")
teleportGuiEvent.Name = "TeleportGUI"
teleportGuiEvent.Parent = teleportEvents

-- Teleport Locations with descriptions
local TeleportLocations = {
    Spawn = {
        position = CFrame.new(0, 5, 0),
        description = "Safe spawn area",
        cost = 0,
        minLevel = 1
    },
    Arena = {
        position = CFrame.new(100, 5, 0),
        description = "PvP Battle Arena",
        cost = 10,
        minLevel = 5
    },
    Shop = {
        position = CFrame.new(-100, 5, 0),
        description = "Item Shop & Trading",
        cost = 5,
        minLevel = 1
    },
    Tower = {
        position = CFrame.new(0, 50, 100),
        description = "Mystic Tower (Advanced)",
        cost = 25,
        minLevel = 10
    },
    Dungeon = {
        position = CFrame.new(-200, -10, -200),
        description = "Dark Dungeon (Dangerous)",
        cost = 50,
        minLevel = 15
    },
    Paradise = {
        position = CFrame.new(500, 100, 500),
        description = "Floating Paradise",
        cost = 100,
        minLevel = 20
    }
}

-- Player data (in real game, this would be in DataStore)
local playerData = {}

-- Initialize player data
local function initializePlayer(player)
    playerData[player.UserId] = {
        gold = 1000, -- Starting gold
        level = 1,   -- Starting level
        teleportCooldown = 0
    }
end

-- Teleport effect
local function createTeleportEffect(character, isArrival)
    local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    if not humanoidRootPart then return end
    
    -- Create particle effect
    local attachment = Instance.new("Attachment")
    attachment.Parent = humanoidRootPart
    
    local particles = Instance.new("ParticleEmitter")
    particles.Texture = "rbxasset://textures/particles/sparkles_main.dds"
    particles.Lifetime = NumberRange.new(0.5, 1.0)
    particles.Rate = 100
    particles.SpreadAngle = Vector2.new(45, 45)
    particles.Speed = NumberRange.new(5, 10)
    particles.Parent = attachment
    
    -- Color based on teleport type
    if isArrival then
        particles.Color = ColorSequence.new(Color3.new(0, 1, 0)) -- Green for arrival
    else
        particles.Color = ColorSequence.new(Color3.new(0, 0, 1)) -- Blue for departure
    end
    
    -- Tween character transparency
    local tweenInfo = TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut)
    
    for _, part in pairs(character:GetChildren()) do
        if part:IsA("BasePart") and part.Name ~= "HumanoidRootPart" then
            local tween = TweenService:Create(part, tweenInfo, {
                Transparency = isArrival and 0 or 0.8
            })
            tween:Play()
        end
    end
    
    -- Clean up effect
    game:GetService("Debris"):AddItem(attachment, 2)
end

-- Handle teleportation
teleportEvent.OnServerEvent:Connect(function(player, locationName)
    local character = player.Character
    if not character or not character:FindFirstChild("HumanoidRootPart") then
        return
    end
    
    local location = TeleportLocations[locationName]
    if not location then
        warn("Invalid teleport location: " .. tostring(locationName))
        return
    end
    
    local data = playerData[player.UserId]
    if not data then
        initializePlayer(player)
        data = playerData[player.UserId]
    end
    
    -- Check cooldown
    local currentTime = tick()
    if currentTime < data.teleportCooldown then
        local waitTime = math.ceil(data.teleportCooldown - currentTime)
        teleportGuiEvent:FireClient(player, "error", "Teleport on cooldown! Wait " .. waitTime .. " seconds.")
        return
    end
    
    -- Check level requirement
    if data.level < location.minLevel then
        teleportGuiEvent:FireClient(player, "error", "Level " .. location.minLevel .. " required for " .. locationName)
        return
    end
    
    -- Check gold cost
    if data.gold < location.cost then
        teleportGuiEvent:FireClient(player, "error", "Need " .. location.cost .. " gold to teleport to " .. locationName)
        return
    end
    
    -- Deduct cost and set cooldown
    data.gold = data.gold - location.cost
    data.teleportCooldown = currentTime + 5 -- 5 second cooldown
    
    -- Create departure effect
    createTeleportEffect(character, false)
    
    -- Wait for effect
    wait(0.5)
    
    -- Teleport player
    character.HumanoidRootPart.CFrame = location.position
    
    -- Create arrival effect
    createTeleportEffect(character, true)
    
    -- Notify player
    teleportGuiEvent:FireClient(player, "success", "Teleported to " .. locationName .. "! Gold: " .. data.gold)
    
    print(player.Name .. " teleported to " .. locationName .. " for " .. location.cost .. " gold")
end)

-- Create teleport pads
for locationName, locationData in pairs(TeleportLocations) do
    local teleportPad = Instance.new("Part")
    teleportPad.Name = "TeleportTo" .. locationName
    teleportPad.Size = Vector3.new(6, 1, 6)
    teleportPad.Material = Enum.Material.Neon
    teleportPad.BrickColor = BrickColor.new("Bright green")
    teleportPad.Anchored = true
    teleportPad.CFrame = locationData.position - Vector3.new(0, 3, 0)
    teleportPad.Parent = workspace
    
    -- Add glow effect
    local pointLight = Instance.new("PointLight")
    pointLight.Brightness = 2
    pointLight.Color = Color3.new(0, 1, 0)
    pointLight.Range = 10
    pointLight.Parent = teleportPad
    
    -- Add click detector
    local clickDetector = Instance.new("ClickDetector")
    clickDetector.MaxActivationDistance = 15
    clickDetector.Parent = teleportPad
    
    -- Add info GUI
    local billboardGui = Instance.new("BillboardGui")
    billboardGui.Size = UDim2.new(0, 200, 0, 100)
    billboardGui.StudsOffset = Vector3.new(0, 4, 0)
    billboardGui.Parent = teleportPad
    
    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(1, 0, 1, 0)
    frame.BackgroundColor3 = Color3.new(0, 0, 0)
    frame.BackgroundTransparency = 0.3
    frame.BorderSizePixel = 0
    frame.Parent = billboardGui
    
    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, 0, 0.5, 0)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = locationName
    titleLabel.TextColor3 = Color3.new(1, 1, 1)
    titleLabel.TextScaled = true
    titleLabel.Font = Enum.Font.SourceSansBold
    titleLabel.Parent = frame
    
    local infoLabel = Instance.new("TextLabel")
    infoLabel.Size = UDim2.new(1, 0, 0.5, 0)
    infoLabel.Position = UDim2.new(0, 0, 0.5, 0)
    infoLabel.BackgroundTransparency = 1
    infoLabel.Text = locationData.description .. " (Cost: " .. locationData.cost .. " gold)"
    infoLabel.TextColor3 = Color3.new(0.8, 0.8, 0.8)
    infoLabel.TextScaled = true
    infoLabel.Font = Enum.Font.SourceSans
    infoLabel.Parent = frame
    
    -- Handle clicks
    clickDetector.MouseClick:Connect(function(player)
        teleportEvent:FireServer(locationName)
    end)
end

-- Initialize players
Players.PlayerAdded:Connect(initializePlayer)

for _, player in pairs(Players:GetPlayers()) do
    initializePlayer(player)
end

-- Cleanup on player leave
Players.PlayerRemoving:Connect(function(player)
    playerData[player.UserId] = nil
end)

print("Advanced Teleportation Hub loaded successfully!")`,

  shop: `-- Advanced Shop System
-- Place this script in ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MarketplaceService = game:GetService("MarketplaceService")

-- Create RemoteEvents
local shopEvents = Instance.new("Folder")
shopEvents.Name = "ShopEvents"
shopEvents.Parent = ReplicatedStorage

local purchaseEvent = Instance.new("RemoteEvent")
purchaseEvent.Name = "PurchaseItem"
purchaseEvent.Parent = shopEvents

local shopGuiEvent = Instance.new("RemoteEvent")
shopGuiEvent.Name = "ShopGUI"
shopGuiEvent.Parent = shopEvents

-- Shop Items Configuration
local ShopItems = {
    Weapons = {
        {
            name = "Steel Sword",
            description = "A reliable blade for combat",
            price = 100,
            currency = "gold",
            stats = {damage = 25, durability = 100},
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Magic Staff",
            description = "Channel mystical energies",
            price = 250,
            currency = "gold",
            stats = {damage = 40, mana = 50},
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Legendary Bow",
            description = "Precision and power combined",
            price = 500,
            currency = "gems",
            stats = {damage = 60, accuracy = 95},
            icon = "rbxasset://textures/face.png"
        }
    },
    Armor = {
        {
            name = "Leather Armor",
            description = "Basic protection for adventurers",
            price = 75,
            currency = "gold",
            stats = {defense = 15, weight = 5},
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Chain Mail",
            description = "Balanced protection and mobility",
            price = 200,
            currency = "gold",
            stats = {defense = 30, weight = 15},
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Dragon Scale Armor",
            description = "Ultimate protection from dragon scales",
            price = 1000,
            currency = "gems",
            stats = {defense = 80, fireResist = 50},
            icon = "rbxasset://textures/face.png"
        }
    },
    Consumables = {
        {
            name = "Health Potion",
            description = "Restores 50 HP instantly",
            price = 25,
            currency = "gold",
            effect = "heal",
            value = 50,
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Mana Potion",
            description = "Restores 30 MP instantly",
            price = 30,
            currency = "gold",
            effect = "mana",
            value = 30,
            icon = "rbxasset://textures/face.png"
        },
        {
            name = "Speed Boost",
            description = "Increases speed for 60 seconds",
            price = 50,
            currency = "gold",
            effect = "speed",
            duration = 60,
            icon = "rbxasset://textures/face.png"
        }
    }
}

-- Player data (in real game, use DataStore)
local playerData = {}
local playerInventories = {}

-- Initialize player data
local function initializePlayer(player)
    playerData[player.UserId] = {
        gold = 1000,
        gems = 50,
        level = 1
    }
    
    playerInventories[player.UserId] = {
        weapons = {},
        armor = {},
        consumables = {}
    }
end

-- Get player currency
local function getPlayerCurrency(player, currencyType)
    local data = playerData[player.UserId]
    if not data then return 0 end
    
    if currencyType == "gold" then
        return data.gold
    elseif currencyType == "gems" then
        return data.gems
    end
    
    return 0
end

-- Deduct currency from player
local function deductCurrency(player, currencyType, amount)
    local data = playerData[player.UserId]
    if not data then return false end
    
    if currencyType == "gold" and data.gold >= amount then
        data.gold = data.gold - amount
        return true
    elseif currencyType == "gems" and data.gems >= amount then
        data.gems = data.gems - amount
        return true
    end
    
    return false
end

-- Add item to player inventory
local function addToInventory(player, category, item)
    local inventory = playerInventories[player.UserId]
    if not inventory then return false end
    
    local categoryInventory = inventory[category:lower()]
    if not categoryInventory then return false end
    
    table.insert(categoryInventory, {
        name = item.name,
        stats = item.stats,
        effect = item.effect,
        value = item.value,
        duration = item.duration,
        purchaseTime = tick()
    })
    
    return true
end

-- Handle item purchase
purchaseEvent.OnServerEvent:Connect(function(player, category, itemIndex)
    local data = playerData[player.UserId]
    if not data then
        initializePlayer(player)
        data = playerData[player.UserId]
    end
    
    -- Validate category and item
    local categoryItems = ShopItems[category]
    if not categoryItems or not categoryItems[itemIndex] then
        shopGuiEvent:FireClient(player, "error", "Invalid item selection")
        return
    end
    
    local item = categoryItems[itemIndex]
    
    -- Check if player has enough currency
    local playerCurrency = getPlayerCurrency(player, item.currency)
    if playerCurrency < item.price then
        local needed = item.price - playerCurrency
        shopGuiEvent:FireClient(player, "error", "Need " .. needed .. " more " .. item.currency .. " to purchase " .. item.name)
        return
    end
    
    -- Process purchase
    if deductCurrency(player, item.currency, item.price) then
        if addToInventory(player, category, item) then
            shopGuiEvent:FireClient(player, "success", "Purchased " .. item.name .. " for " .. item.price .. " " .. item.currency)
            
            -- Update player's currency display
            shopGuiEvent:FireClient(player, "currency_update", {
                gold = data.gold,
                gems = data.gems
            })
            
            print(player.Name .. " purchased " .. item.name .. " for " .. item.price .. " " .. item.currency)
        else
            -- Refund if inventory add failed
            if item.currency == "gold" then
                data.gold = data.gold + item.price
            else
                data.gems = data.gems + item.price
            end
            shopGuiEvent:FireClient(player, "error", "Failed to add item to inventory")
        end
    else
        shopGuiEvent:FireClient(player, "error", "Transaction failed")
    end
end)

-- Send shop data to client
local function sendShopData(player)
    shopGuiEvent:FireClient(player, "shop_data", {
        items = ShopItems,
        playerData = playerData[player.UserId]
    })
end

-- Handle shop GUI requests
shopGuiEvent.OnServerEvent:Connect(function(player, action, data)
    if action == "request_shop_data" then
        sendShopData(player)
    elseif action == "request_inventory" then
        shopGuiEvent:FireClient(player, "inventory_data", playerInventories[player.UserId])
    end
end)

-- Create shop NPC
local function createShopNPC()
    local npc = Instance.new("Model")
    npc.Name = "ShopKeeper"
    npc.Parent = workspace
    
    -- Create basic NPC parts (simplified)
    local humanoid = Instance.new("Humanoid")
    humanoid.MaxHealth = 100
    humanoid.Health = 100
    humanoid.Parent = npc
    
    local head = Instance.new("Part")
    head.Name = "Head"
    head.Size = Vector3.new(2, 1, 1)
    head.BrickColor = BrickColor.new("Light orange")
    head.Parent = npc
    
    local torso = Instance.new("Part")
    torso.Name = "Torso"
    torso.Size = Vector3.new(2, 2, 1)
    torso.BrickColor = BrickColor.new("Bright green")
    torso.Parent = npc
    
    local humanoidRootPart = Instance.new("Part")
    humanoidRootPart.Name = "HumanoidRootPart"
    humanoidRootPart.Size = Vector3.new(2, 2, 1)
    humanoidRootPart.Transparency = 1
    humanoidRootPart.CanCollide = false
    humanoidRootPart.Parent = npc
    
    -- Position NPC
    npc:SetPrimaryPartCFrame(CFrame.new(-100, 5, 0))
    
    -- Add click detector
    local clickDetector = Instance.new("ClickDetector")
    clickDetector.MaxActivationDistance = 10
    clickDetector.Parent = head
    
    -- Add shop sign
    local billboardGui = Instance.new("BillboardGui")
    billboardGui.Size = UDim2.new(0, 200, 0, 50)
    billboardGui.StudsOffset = Vector3.new(0, 3, 0)
    billboardGui.Parent = head
    
    local shopLabel = Instance.new("TextLabel")
    shopLabel.Size = UDim2.new(1, 0, 1, 0)
    shopLabel.BackgroundTransparency = 1
    shopLabel.Text = "🛒 SHOP KEEPER"
    shopLabel.TextColor3 = Color3.new(1, 1, 0)
    shopLabel.TextScaled = true
    shopLabel.Font = Enum.Font.SourceSansBold
    shopLabel.Parent = billboardGui
    
    -- Handle shop interaction
    clickDetector.MouseClick:Connect(function(player)
        sendShopData(player)
        shopGuiEvent:FireClient(player, "open_shop")
    end)
    
    return npc
end

-- Initialize players
Players.PlayerAdded:Connect(function(player)
    initializePlayer(player)
    
    -- Send shop data when player joins
    player.CharacterAdded:Connect(function()
        wait(2) -- Wait for character to load
        sendShopData(player)
    end)
end)

for _, player in pairs(Players:GetPlayers()) do
    initializePlayer(player)
end

-- Cleanup on player leave
Players.PlayerRemoving:Connect(function(player)
    playerData[player.UserId] = nil
    playerInventories[player.UserId] = nil
end)

-- Create shop NPC
createShopNPC()

print("Advanced Shop System loaded successfully!")`,

  default: `-- Welcome & Player Management System
-- Place this script in ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

-- Create RemoteEvents
local playerEvents = Instance.new("Folder")
playerEvents.Name = "PlayerEvents"
playerEvents.Parent = ReplicatedStorage

local welcomeEvent = Instance.new("RemoteEvent")
welcomeEvent.Name = "WelcomePlayer"
welcomeEvent.Parent = playerEvents

-- Player data tracking
local playerStats = {}

-- Welcome messages
local welcomeMessages = {
    "Welcome to our amazing world!",
    "Get ready for an epic adventure!",
    "Your journey begins now!",
    "Explore, build, and have fun!",
    "Welcome to the community!"
}

-- Initialize new player
local function initializePlayer(player)
    playerStats[player.UserId] = {
        joinTime = tick(),
        level = 1,
        experience = 0,
        playtime = 0
    }
    
    print("🎮 " .. player.Name .. " joined the game!")
end

-- Create welcome GUI
local function createWelcomeGUI(player)
    local character = player.Character or player.CharacterAdded:Wait()
    local head = character:WaitForChild("Head")
    
    -- Create floating welcome message
    local gui = Instance.new("BillboardGui")
    gui.Size = UDim2.new(0, 300, 0, 100)
    gui.StudsOffset = Vector3.new(0, 4, 0)
    gui.Parent = head
    
    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(1, 0, 1, 0)
    frame.BackgroundColor3 = Color3.new(0, 0.5, 1)
    frame.BackgroundTransparency = 0.2
    frame.BorderSizePixel = 0
    frame.Parent = gui
    
    -- Add corner rounding
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 10)
    corner.Parent = frame
    
    local welcomeLabel = Instance.new("TextLabel")
    welcomeLabel.Size = UDim2.new(1, 0, 0.6, 0)
    welcomeLabel.BackgroundTransparency = 1
    welcomeLabel.Text = "🌟 " .. welcomeMessages[math.random(1, #welcomeMessages)]
    welcomeLabel.TextColor3 = Color3.new(1, 1, 1)
    welcomeLabel.TextScaled = true
    welcomeLabel.Font = Enum.Font.SourceSansBold
    welcomeLabel.Parent = frame
    
    local nameLabel = Instance.new("TextLabel")
    nameLabel.Size = UDim2.new(1, 0, 0.4, 0)
    nameLabel.Position = UDim2.new(0, 0, 0.6, 0)
    nameLabel.BackgroundTransparency = 1
    nameLabel.Text = player.Name .. "!"
    nameLabel.TextColor3 = Color3.new(1, 1, 0)
    nameLabel.TextScaled = true
    nameLabel.Font = Enum.Font.SourceSansBold
    nameLabel.Parent = frame
    
    -- Animate the welcome GUI
    frame.Size = UDim2.new(0, 0, 0, 0)
    frame.Position = UDim2.new(0.5, 0, 0.5, 0)
    
    local tweenInfo = TweenInfo.new(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
    local tween = TweenService:Create(frame, tweenInfo, {
        Size = UDim2.new(1, 0, 1, 0),
        Position = UDim2.new(0, 0, 0, 0)
    })
    tween:Play()
    
    -- Remove GUI after 5 seconds
    game:GetService("Debris"):AddItem(gui, 5)
    
    -- Fade out animation
    wait(3)
    local fadeInfo = TweenInfo.new(2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
    local fadeTween = TweenService:Create(frame, fadeInfo, {
        BackgroundTransparency = 1
    })
    local fadeTextTween1 = TweenService:Create(welcomeLabel, fadeInfo, {
        TextTransparency = 1
    })
    local fadeTextTween2 = TweenService:Create(nameLabel, fadeInfo, {
        TextTransparency = 1
    })
    
    fadeTween:Play()
    fadeTextTween1:Play()
    fadeTextTween2:Play()
end

-- Give starter items
local function giveStarterItems(player)
    local character = player.Character
    if not character then return end
    
    -- Create starter tool
    local tool = Instance.new("Tool")
    tool.Name = "Starter Sword"
    tool.RequiresHandle = true
    
    local handle = Instance.new("Part")
    handle.Name = "Handle"
    handle.Size = Vector3.new(0.2, 4, 0.2)
    handle.BrickColor = BrickColor.new("Really black")
    handle.Material = Enum.Material.Metal
    handle.Parent = tool
    
    -- Add tool to player's backpack
    tool.Parent = player.Backpack
    
    print("📦 Gave starter items to " .. player.Name)
end

-- Handle player joining
Players.PlayerAdded:Connect(function(player)
    initializePlayer(player)
    
    -- Wait for character to spawn
    player.CharacterAdded:Connect(function(character)
        wait(2) -- Wait for character to fully load
        
        -- Create welcome GUI
        spawn(function()
            createWelcomeGUI(player)
        end)
        
        -- Give starter items
        spawn(function()
            wait(1)
            giveStarterItems(player)
        end)
        
        -- Add spawn effect
        local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
        
        -- Create spawn particles
        local attachment = Instance.new("Attachment")
        attachment.Parent = humanoidRootPart
        
        local particles = Instance.new("ParticleEmitter")
        particles.Texture = "rbxasset://textures/particles/sparkles_main.dds"
        particles.Lifetime = NumberRange.new(1.0, 2.0)
        particles.Rate = 50
        particles.SpreadAngle = Vector2.new(45, 45)
        particles.Speed = NumberRange.new(5, 15)
        particles.Color = ColorSequence.new(Color3.new(0, 1, 1))
        particles.Parent = attachment
        
        -- Remove particles after 3 seconds
        game:GetService("Debris"):AddItem(attachment, 3)
    end)
end)

-- Handle player leaving
Players.PlayerRemoving:Connect(function(player)
    local stats = playerStats[player.UserId]
    if stats then
        local playtime = tick() - stats.joinTime
        print("👋 " .. player.Name .. " left after playing for " .. math.floor(playtime) .. " seconds")
        playerStats[player.UserId] = nil
    end
end)

-- Periodic player updates
spawn(function()
    while true do
        wait(60) -- Update every minute
        
        for userId, stats in pairs(playerStats) do
            stats.playtime = tick() - stats.joinTime
            
            -- Find player
            local player = nil
            for _, p in pairs(Players:GetPlayers()) do
                if p.UserId == userId then
                    player = p
                    break
                end
            end
            
            if player then
                -- Award experience for playtime
                stats.experience = stats.experience + 10
                
                -- Level up check
                local requiredExp = stats.level * 100
                if stats.experience >= requiredExp then
                    stats.level = stats.level + 1
                    stats.experience = stats.experience - requiredExp
                    
                    -- Notify player of level up
                    welcomeEvent:FireClient(player, "level_up", stats.level)
                    print("🎉 " .. player.Name .. " reached level " .. stats.level .. "!")
                end
            end
        end
    end
end)

-- Handle remote events
welcomeEvent.OnServerEvent:Connect(function(player, action, data)
    if action == "get_stats" then
        local stats = playerStats[player.UserId]
        if stats then
            welcomeEvent:FireClient(player, "stats_update", stats)
        end
    end
end)

print("🎮 Welcome & Player Management System loaded successfully!")`,
}

export function getDemoScript(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (
    lowerPrompt.includes("weapon") ||
    lowerPrompt.includes("gun") ||
    lowerPrompt.includes("damage") ||
    lowerPrompt.includes("combat")
  ) {
    return demoScripts.weapon
  } else if (
    lowerPrompt.includes("npc") ||
    lowerPrompt.includes("follow") ||
    lowerPrompt.includes("quest") ||
    lowerPrompt.includes("ai")
  ) {
    return demoScripts.npc
  } else if (
    lowerPrompt.includes("teleport") ||
    lowerPrompt.includes("tp") ||
    lowerPrompt.includes("travel") ||
    lowerPrompt.includes("portal")
  ) {
    return demoScripts.teleport
  } else if (
    lowerPrompt.includes("shop") ||
    lowerPrompt.includes("store") ||
    lowerPrompt.includes("buy") ||
    lowerPrompt.includes("purchase")
  ) {
    return demoScripts.shop
  } else {
    return demoScripts.default
  }
}
