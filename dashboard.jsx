import { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

function Dashboard() {
    const [country, setCountry] = useState("");
    const [universities, setUniversities] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");

    const fetchUniversitiesByCountry = async () => {
        const response = await axios.get('https://github.com/Hipo/university-domains-list?tab=readme-ov-file#2---using-the-hosted-api');
        setUniversities(response.data);
       
        const res = await axios.get(`http://127.0.0.1:5500/api/universities?country=${country}`);

    
        const uniqueStates = [...new 
            Set(response.data.map(univ => univ["univ-state-provision"]).filter(Boolean))];
            setStates(uniqueStates);
            setSelectedState("");
    };


        const filterUniversitiesByState = (state) => {
        setSelectedState(state);
        const filtered = universities.filter(univ => univ["univ-state-provision"] === selectedState);
        setUniversities(filtered);
        };
    
        const downloadDashboardCard = (id) => {
        const card = document.getElementById(id);
        html2canvas(card).then(canvas => { 
            const link = document.createElement("a");
            link.download = "dashboard_card.png";
            link.href = canvas.toDataURL();
            link.click();
        });
     }
    };
    return (
        <div> style={{ padding: '20px' }}
            <h1>University Dashboard</h1> 
            
            
                <input
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}/>
                    <button onClick={searchByCountry}>Search</button>
                
            {states.length > 0 && (
                <select onChange={(e) => filterUniversitiesByState(e.target.value)} value={selectedState}>
                    <option value="">All States</option>
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            )}

            <div style ={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {filteredUniversities.map((univ, index) => ( 
            <div key={index}
                    id={`univ-card-${index}`}
                    style={{ border: '1px solid #d8d6d6ff', borderRadius: '8px', padding: '15px'}}>

                        <h4>{univ.name}</h4>
                        <p>{univ.country}</p>
                        <p>{univ["univ-state-provision"] || "Not Available"}</p>
                        <a href={univ.web_pages[0]} 
                            target="_blank">
                            Visit Website
                        </a>
                        <br/>
                        <button onClick={() => downloadDashboardCard(`univ-card-${index}`)}>Download Card</button>
                    </div>
                 ))}

 
                

            </div>
            </div>
    );
 export default dashboard;

             
