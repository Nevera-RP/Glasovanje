function mysqlQuery(query, params)
	if Config.MySQL == "oxmysql" then
		return exports["oxmysql"]:query_async(query, params)
	elseif Config.MySQL == "mysql-async" then
		local p = promise.new()

		exports['mysql-async']:mysql_execute(query, params, function(result)
			p:resolve(result)
		end)

		return Citizen.Await(p)
	elseif Config.MySQL == "ghmattimysql" then
		return exports['ghmattimysql']:executeSync(query, params)
	end
end


