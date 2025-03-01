import {getData, getMatchData} from "../Data/getData.js";

type Splits = {
    Nether: number,
    Bastion: number,
    Fortress: number,
    Blind: number,
    Stronghold: number,
    End: number,
}

type Player = {
    name: string,
    uuid: string,
    isWinner: boolean,
    OriginalElo: number,
    Elo: number,
    Rank: number,
    Splits: Splits
}



type Seed = {
    Overworld: string,
    Bastion: string,
}

type Match = {
    Player1: Player,
    Player2: Player,
    Seed: Seed,
    FinalTime: number,
    EloChange: number,
    CreatedAt: number,
    id: number,
    state: string,
}

const matches: Match[] = [];


function clearOld() {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);

    for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        if (currentUnixTimestamp - match.CreatedAt > 100) {
            matches.splice(i, 1);
        }
    }
}

type TimelineElement = {
    uuid: string,
    time: number,
    type: string,
}

function SwapPlayers(INPUT:Match){
    const tmp1: Match = {
        Player1: {
            name: INPUT.Player2.name,
            uuid: INPUT.Player2.uuid,
            isWinner: INPUT.Player2.isWinner,
            OriginalElo: INPUT.Player2.OriginalElo,
            Elo: INPUT.Player2.Elo,
            Rank: INPUT.Player2.Rank,
            Splits: INPUT.Player2.Splits,
        },
        Player2: {
            name: INPUT.Player1.name,
            uuid: INPUT.Player1.uuid,
            isWinner: INPUT.Player1.isWinner,
            OriginalElo: INPUT.Player1.OriginalElo,
            Elo: INPUT.Player1.Elo,
            Rank: INPUT.Player1.Rank,
            Splits: INPUT.Player1.Splits,
        },
        Seed: INPUT.Seed,
        FinalTime: INPUT.FinalTime,
        EloChange: INPUT.EloChange,
        CreatedAt: INPUT.CreatedAt,
        id: INPUT.id,
        state: INPUT.state,
    }
    return(tmp1);
}

async function addFromData() {
    try {
        const NewData = await getData();
        const jsondata = JSON.parse(NewData);

        const currentUnixTimestamp = Math.floor(Date.now() / 1000);

        let matchids: number[] = [];
        matches.forEach((match: Match) => {
            matchids.push(match.id);
        });

        for (const item of jsondata.data) {
            if (currentUnixTimestamp - item.date < 100 && !matchids.includes(item.id)) {

                let Winner: string;
                let Player1Winner: boolean;
                let Player2Winner: boolean;
                if (item.result.uuid == item.players[0].uuid) {
                    Winner = item.players[0].nickname;
                    Player1Winner = true;
                    Player2Winner = false;
                } else {
                    Winner = item.players[1].nickname;
                    Player1Winner = false;
                    Player2Winner = true;
                }

                let state: string;
                if(Math.abs(item.changes[1].change) < 5 && item.forfeited == true){
                    state = "DRAW"
                } else if(item.forfeited == true){
                    state = "FORFEITED"
                } else {
                    state = "DEFAULT"
                }

                let change = Math.abs(item.changes[0].change)
                if(Math.abs(item.changes[1].change) > change){
                    change = Math.abs(item.changes[1].change)
                }

                const MatchData = await getMatchData(item.id);
                const jsonMatchdata = JSON.parse(MatchData);
                let p1nether:number = 100000000000;
                let p1bastion:number = 100000000000;
                let p1fortress:number = 100000000000;
                let p1blind:number = 100000000000;
                let p1stronghold:number = 100000000000;
                let p1end:number = 100000000000;

                let p2nether:number = 100000000000;
                let p2bastion:number = 100000000000;
                let p2fortress:number = 100000000000;
                let p2blind:number = 100000000000;
                let p2stronghold:number = 100000000000;
                let p2end:number = 100000000000;

                const p1user = item.players[0].uuid;
                const p2user = item.players[1].uuid;

                jsonMatchdata.data.timelines.forEach((item:TimelineElement) => {
                    if(item.uuid == p1user){
                        if(item.type == "story.enter_the_nether"){
                            p1nether = item.time;
                        }else if(item.type == "nether.find_bastion"){
                            p1bastion = item.time;
                        }else if(item.type == "nether.find_fortress"){
                            p1fortress = item.time;
                        }else if(item.type == "projectelo.timeline.blind_travel"){
                            p1blind = item.time;
                        }else if(item.type == "story.follow_ender_eye"){
                            p1stronghold = item.time;
                        }else if(item.type == "story.enter_the_end"){
                            p1end = item.time;
                        }
                    } else if(item.uuid == p2user){
                        if(item.type == "story.enter_the_nether"){
                            p2nether = item.time;
                        }else if(item.type == "nether.find_bastion"){
                            p2bastion = item.time;
                        }else if(item.type == "nether.find_fortress"){
                            p2fortress = item.time;
                        }else if(item.type == "projectelo.timeline.blind_travel"){
                            p2blind = item.time;
                        }else if(item.type == "story.follow_ender_eye"){
                            p2stronghold = item.time;
                        }else if(item.type == "story.enter_the_end"){
                            p2end = item.time;
                        }
                    }
                })



                const Game: Match = {
                    Player1: {
                        name: item.players[0].nickname,
                        uuid: item.players[0].uuid,
                        isWinner: Player1Winner,
                        OriginalElo: item.players[0].eloRate,
                        Elo: item.changes[0].eloRate,
                        Rank: item.players[0].eloRank,
                        Splits: {
                            Nether: p1nether,
                            Bastion: p1bastion,
                            Fortress: p1fortress,
                            Blind: p1blind,
                            Stronghold: p1stronghold,
                            End: p1end
                        },
                    },
                    Player2: {
                        name: item.players[1].nickname,
                        uuid: item.players[1].uuid,
                        isWinner: Player2Winner,
                        OriginalElo: item.players[1].eloRate,
                        Elo: item.changes[1].eloRate,
                        Rank: item.players[1].eloRank,
                        Splits: {
                            Nether: p2nether,
                            Bastion: p2bastion,
                            Fortress: p2fortress,
                            Blind: p2blind,
                            Stronghold: p2stronghold,
                            End: p2end
                        },
                    },
                    Seed: {
                        Overworld: item.seedType,
                        Bastion: item.bastionType,
                    },
                    FinalTime: item.result.time,
                    EloChange: change,
                    CreatedAt: item.date,
                    id: item.id,
                    state: state,
                };
                matches.push(Game);
            }
        }
    } catch (err) {
        //console.error('ERROR:', err);
    }



    clearOld();
    matches.forEach((match) => {
        console.log(`AGE: ${Math.floor(Date.now() / 1000) - match.CreatedAt} Player1: ${match.Player1.name}, Player2: ${match.Player2.name}, WINNER1: ${match.Player1.isWinner},FinalTime: ${match.FinalTime}, EloChange: ${match.EloChange}, CreatedAt: ${match.CreatedAt}, id: ${match.id} `);
    });

    console.log("----------------------")
    //console.log("INDEX: " + Math.floor(Date.now() / 1000));
    //console.log("----------------------")
}

export async function startTracking() {
    addFromData();
    setInterval(addFromData, 5000);
}


export function getMatches():Match[] {
    return matches;
}

export function getMatchByPlayerName(playerName: string): Match | null {

    for (const match of matches) {

        if (match.Player1.name === playerName) {
            return match;
        }else if(match.Player2.name === playerName){
            return SwapPlayers(match);
        }
    }

    return null;
}
