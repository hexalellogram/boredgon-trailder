const base_url = 'https://api-dot-la-hacks-gamers.wl.r.appspot.com'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('username') /* && urlParams.has('data') */){
    var table = document.getElementById("match_table");
    const username = urlParams.get('username')
    //const data = urlParams.get('data')
    console.log(username);
    //console.log(data);
    fetch(base_url + '/match/' + username /* + '?' + new URLSearchParams({
        data: data
    }) */ )
        .then(response => response.json())
        .then(data => {
            console.log(data)
            users = data['users']
            users.forEach(element => {
                for (let key in element){
                    var name = key
                }
                var discord = element[name][0]
                var bio = element[name][1]
                var pic = element[name][2]
                console.log(name)
                console.log(discord)
                var row = table.insertRow(-1);
                var pcell = row.insertCell(0);
                var ncell = row.insertCell(1);
                var dcell = row.insertCell(2);
                var bcell = row.insertCell(3);
                pcell.innerHTML = '<image src=' + pic + '></image>'
                ncell.innerHTML = name
                dcell.innerHTML = discord
                bcell.innerHTML = bio
            });
        });
} else {
    // TODO
}