import React, { useState, useEffect } from 'react';

const Overall = () => {
  const [Fulldata1, setFulldata1] = useState([]);
  const [Rest, setRest] = useState([]);
  const [First, setFirst] = useState([]);
  const [teamData, setTeamData] = useState([]);  // Fix: Add setTeamData
  const [backgroundData, setBackgroundData] = useState([]);
 

  
  useEffect(() => {
    // Fetch data from the Google Apps Script endpoint
    fetch('https://script.google.com/macros/s/AKfycbz_-_5VFES00VsB2Ad3eKetjDhOOg1lAvd9ppHUvAhAJkQzvzA0mgqB87Pmsy5ZMS32/exec')
      .then(response => response.json())
      .then(data => setFulldata1(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array means this effect will run only once
  
  useEffect(() => {
    const Data = localStorage.getItem('tRMS');
    const Data1 = localStorage.getItem('tFMS');
  
    if (Data) {
      setFirst(JSON.parse(Data1));
      setRest(JSON.parse(Data));
    }
  }, []);
  
  useEffect(() => {
    // Fetch data from the Google Apps Script endpoint
    fetch('https://script.google.com/macros/s/AKfycbwbu5sH38_JbhQzt7jn3h2gK4ZNNtGbXBD9D6-tCUzQFNtr9UOrWGeWRP_P7X3FgtbN/exec')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const dataArray = Array.from(data.data);

        const processData = (data) => {
          const teamsMap = new Map();

          // Iterate through the data and group players by team name
          data.forEach((item) => {
            const teamName = item["TeamName"];
            if (!teamsMap.has(teamName)) {
              teamsMap.set(teamName, {
                "TeamName": teamName,
                "TeamLogo": item["TeamLogo"],
                "TeamFlag": item["TeamFlag"],
                "TeamKills": item["TeamKills"],
                "TeamPosition": item["TeamPosition"],
                "TotalPoints": item["TotalPoint"],
                "WWCD": item["Chicken"],
                Players: [],
              });
            }

            teamsMap.get(teamName).Players.push({
              "PlayerName": item["PlayerName"],
              "Kills": item["Kills"],
              "Contribution": item["Contribution"]
            });
          });

          // Convert the Map to an array of teams
          const teams = Array.from(teamsMap.values());

          // Create the final object structure
          const formattedData = {
            "Teams": teams,
          };

          return formattedData;
        };

        // Process and format the data
        const formattedData = processData(dataArray);
        console.log(formattedData);
        formattedData.Teams.sort((a, b) => {
          if (a.TotalPoints !== b.TotalPoints) {
            return b.TotalPoints - a.TotalPoints;
          } else {
            // If TotalPoints are the same, continue sorting by TeamPosition
            if (a.WWCD !== b.WWCD) {
              return b.WWCD - a.WWCD; // Sort by TeamPosition in ascending order
            } else {
            // If TotalPoints are the same, continue sorting by TeamPosition
            if (a.TeamPosition !== b.TeamPosition) {
              return b.TeamPosition - a.TeamPosition; // Sort by TeamPosition in ascending order
            } else {
              // If TeamPosition is the same, continue sorting by Kills
              if (a.TeamKills !== b.TeamKills) {
                return b.TeamKills - a.TeamKills; // Sort by TeamKills in descending order
              } else {
                // If all criteria are the same, sort by the order of appearance
                const earliestA = teamData.findIndex((team) => team.TeamName === a.TeamName);
                const earliestB = teamData.findIndex((team) => team.TeamName === b.TeamName);
                return earliestA - earliestB; // Sort by the order of appearance
              }
            }
          }
          }
        });

        let FirstTeam = formattedData.Teams[0]; // Change index to 0 for the first team
        let RestTeam = formattedData.Teams.slice(0, 25);

        console.log(FirstTeam, 'first');
        console.log(RestTeam, 'rest');
        setFirst(FirstTeam);
        setRest(RestTeam);
        localStorage.setItem('tFMS', JSON.stringify(FirstTeam));
        localStorage.setItem('tRMS', JSON.stringify(RestTeam));

        // Fix: Set the teamData state
        setTeamData(formattedData.Teams);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  

  useEffect(() => {
    fetch('/api/fulldata1')
      .then(response => response.json())
      .then(data => setFulldata1(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('/api/teamData')
      .then(response => response.json())
      .then(data => setTeamData(data))  // Fix: Set the teamData state
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    // Make an HTTP request to your Google Apps Script endpoint
    fetch('https://script.google.com/macros/s/AKfycbwuj7mXtxqsKXYMyh_RtWIeXHoDY0eIBeSUqwBRKshSuXgzZTOzUizLlyquRH-TaG4z/exec')
      .then(response => response.json())
      .then(data => {
        setBackgroundData(data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz5MaS11pgUeKkrXBXricCRDD71zmPapnT0yeeq75mcTpW7ivy_sVGSK9uf9fajK79T/exec');
        const data = await response.json();

        const primaryColorItem = data.data.find(item => item.MATCH === 'Primary Color');
        const secondaryColorItem = data.data.find(item => item.MATCH === 'Secondary Color');

        if (primaryColorItem) {
          setPrimaryColor(primaryColorItem.MAP);
        }

        if (secondaryColorItem) {
          setSecondaryColor(secondaryColorItem.MAP);
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchDataFromApi();
  }, []);


return (
        <div className="display-frame">
         <div className="background">
         {backgroundData.map((item, index) => (
          <img
            key={index}
            className="backgroundimg"
            alt="flag"
            src={item.BACKGROUND}
          />
        ))}
                                </div>
        
                <div className="overlap-wrapper">
                    <div className="overlap">
                        <div className="HEAD">
                            <div className="overlap-group">
                                <div className="STROKE">
                                    <div className="text-wrapper">OVERALL STANDING</div>
                                </div>
                                    <div className="OVERALL-STANDING">
                                      <div className="text-wrapper-3">OVERALL STANDING</div>
                                    </div>
                                { Fulldata1.length > 0 && Fulldata1[1] && (
                                  <div key={Fulldata1[1].TournamentName}>
                                    <div className="tournament-name">
                                      <div className="overalldiv">{Fulldata1[1].TournamentName}</div>
                                    </div>
                                    
                                      <img className="TOURNAMENTLOGO" src={Fulldata1[1].TournamentLogo} />
                                    
                                    <div className="MATCH"style={{ backgroundColor: primaryColor }}>
                                      <div className="text-wrapper-2">{Fulldata1[1].Match}</div>
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>
                        <div className="TOP-BOX">
                            <div className="RANK-BOX">
                                <div className="text-wrapper-4">RANK</div>
                            </div>
                            <div className="TEAM">
                                <div className="text-wrapper-5">TEAM</div>
                            </div>
                            <div className="BOX"style={{ backgroundColor: secondaryColor }}>
                                <div className="text-wrapper-6">WWCD</div>
                                <div className="text-wrapper-7">PLACE</div>
                                <div className="text-wrapper-8">ELIM</div>
                                <div className="text-wrapper-9">TOTAL</div>
                            </div>
                        </div>
                        <div className="standing-box">
                        <div className="POINT-BOX">
                          {Rest.slice(21, 25).map((team, index) => (
                            <div key={index} className="TEAM-BOX">
                              <div className="RANK">
                                <div className="text-wrapper-10">#{index + 21}</div>
                              </div>
                              <div className="team-logo">
                                <img className="logo1" alt="logo" src={team.TeamLogo} />
                              </div>
                              <div className="FLAG">
                                    <img
                                    className="FLAG1"
                                    alt="flag"
                                    src="https://media.discordapp.net/attachments/1179258727061270650/1184080735892676659/Flag_of_Nepal.svg_1.png?ex=658aac1e&is=6578371e&hm=a52ad979cd2ab31f40b327038481b297e99782a60d250a73a0ebdebacbe9a9cb&=&format=webp&quality=lossless&width=356&height=434"
                                    />
                                </div>
                              <div className="text-wrapper-11">{team.TeamName}</div>
                              <div className='team-details'>
                                <div className="WWCD-wrapper">
                                  <div className="text-wrapper-12">{team.WWCD}</div>
                                </div>
                                <div className="PLACE-wrapper">
                                  <div className="text-wrapper-12">{team.TeamPosition}</div>
                                </div>
                                <div className="ELIM-wrapper">
                                  <div className="text-wrapper-12">{team.TeamKills}</div>
                                </div>
                                <div className="TOTAL-wrapper">
                                  <div className="text-wrapper-12">{team.TotalPoints}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* ... rest of your component ... */}
                      </div>
                    </div>
                    <img className="production-logo" alt="" src="https://media.discordapp.net/attachments/1181890589701189694/1181890687248109650/Power-Play-Logo-Design-Png.png?ex=6582b47a&is=65703f7a&hm=c8d0ef3d83a6fe2ce659d95b3d05fb512c6a742724bcc99381bb2bb999533578&=&format=webp&quality=lossless&width=621&height=621"/>
                      

                    
                </div>
            </div>
    );
};

export default Overall;