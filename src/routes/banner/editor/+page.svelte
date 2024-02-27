<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    interface Banner {
        topLeft: string;
        bottomLeft: string;
        centerLeft: string;
        centerRight: string;
        topRight: string;
        bottomRight: string;
    }
    let banner: Banner = {
        topLeft: "Welcome",
        bottomLeft: "First Tech Challenge",
        centerLeft: "",
        centerRight: "",
        topRight: "",
        bottomRight: "",
    };
    let lastBanner: Banner = {
        topLeft: "Welcome",
        bottomLeft: "First Tech Challenge",
        centerLeft: "",
        centerRight: "",
        topRight: "",
        bottomRight: "",
    };
    let lastLastBanner: Banner = {
        topLeft: "Welcome",
        bottomLeft: "First Tech Challenge",
        centerLeft: "",
        centerRight: "",
        topRight: "",
        bottomRight: "",
    };

    enum BannerFields {
        topLeft,
        bottomLeft,
        centerLeft,
        centerRight,
        topRight,
        bottomRight,
    }

    let selectedField = {
        valInternal: BannerFields.topLeft,
        aListener: function (val: BannerFields) {},
        set val(val) {
            this.valInternal = val;
            this.aListener(val);
        },
        get val() {
            return this.valInternal;
        },
        registerListener: function (listener: (val: BannerFields) => void) {
            this.aListener = listener;
        },
    };

    selectedField.registerListener(function (val) {
        document.getElementById("topLeftBtn")?.classList.remove("selected");
        document.getElementById("bottomLeftBtn")?.classList.remove("selected");
        document.getElementById("centerLeftBtn")?.classList.remove("selected");
        document.getElementById("centerRightBtn")?.classList.remove("selected");
        document.getElementById("topRightBtn")?.classList.remove("selected");
        document.getElementById("bottomRightBtn")?.classList.remove("selected");
        switch (val) {
            case BannerFields.topLeft:
                document
                    .getElementById("topLeftBtn")
                    ?.classList.add("selected");
                break;
            case BannerFields.bottomLeft:
                document
                    .getElementById("bottomLeftBtn")
                    ?.classList.add("selected");
                break;
            case BannerFields.centerLeft:
                document
                    .getElementById("centerLeftBtn")
                    ?.classList.add("selected");
                break;
            case BannerFields.centerRight:
                document
                    .getElementById("centerRightBtn")
                    ?.classList.add("selected");
                break;
            case BannerFields.topRight:
                document
                    .getElementById("topRightBtn")
                    ?.classList.add("selected");
                break;
            case BannerFields.bottomRight:
                document
                    .getElementById("bottomRightBtn")
                    ?.classList.add("selected");
                break;
        }
    });

    let firstGrab = true;
    let editIndex = {
        valInternal: 0,
        aListener: function (val: number) {},
        set val(val) {
            this.valInternal = val;
            this.aListener(val);
        },
        get val() {
            return this.valInternal;
        },
        registerListener: function (listener: (val: number) => void) {
            this.aListener = listener;
        },
    };

    const uiIp =
        $page.url.toString().split("/").slice(0, 4).join("/") + "/match";
    let serverIp = "ws://localhost:20240";

    const user = data.FTC_API_USERNAME;
    const key = data.FTC_API_KEY;
    const base64 = btoa(user + ":" + key);

    interface AllEvents {
        eventCount: number;
        events: ParsedEvent[];
    }

    interface ParsedEvent {
        code: string;
        country: string;
        liveStreamUrl?: string;
        name: string;
        venue: string;
        dateStart: string;
        dateEnd: string;
    }

    interface SpecificEvent {
        code: string;
        qualifiers: Match[];
        playoffs: Match[];
    }

    interface Match {
        description: string;
        field: string;
        tournamentLevel: string;
        startTime: string;
        series: number;
        matchNumber: number;
        teams: Team[];
        modifiedOn: string;
    }

    interface Team {
        teamNumber: number;
        displayTeamNumber: string;
        station: string;
        team: string;
        teamName: string;
        surrogate: boolean;
        noShow: boolean;
    }

    interface MatchesDictionary {
        [key: string]: Match[];
    }

    let allEvents: ParsedEvent[] = [];

    let eventCode = "";
    let specificEvent: SpecificEvent | null;
    let matchType = "Qualification ";
    let selectedMatch: Match | null;
    let submit = "";
    let submitAnd = "";

    onMount(() => {
        refreshData();

        serverIp = "ws://" + location.host.toString().split(":")[0] + ":20240";
        const socket = new WebSocket(serverIp);

        socket.onopen = () => {
            console.log("Connected to live banner WebSocket");
        };
        socket.onmessage = (event) => {
            if (firstGrab) {
                firstGrab = false;
                if (
                    (event.data as string) !=
                    JSON.stringify({
                        topLeft: "Awaiting Data...",
                        bottomLeft: "Made by Jining Liu",
                        centerLeft: "",
                        centerRight: "",
                        topRight: "Westwood Robotics",
                        bottomRight: "FTC 20240 Slingshot",
                    })
                ) {
                    banner = JSON.parse(event.data as string) as Banner;
                    lastBanner = JSON.parse(event.data as string) as Banner;
                    lastLastBanner = JSON.parse(event.data as string) as Banner;
                }
            }
        };

        editIndex.registerListener(function (val) {
            socket.send(JSON.stringify(banner));
        });
    });

    function update() {
        if (editIndex.val + 1 > 1) {
            lastLastBanner = lastBanner;
        }
        lastBanner = JSON.parse(JSON.stringify(banner));
        editIndex.val++;
    }

    function last() {
        banner = lastLastBanner;
        const temp = lastLastBanner;
        lastLastBanner = JSON.parse(JSON.stringify(lastBanner));
        lastBanner = JSON.parse(JSON.stringify(temp));
    }

    async function refreshData() {
        const response = await fetch(
            "https://ftc-api.firstinspires.org/v2.0/2023/events",
            {
                method: "GET",
                headers: {
                    Authorization: "Basic " + base64,
                },
            },
        );
        allEvents = (JSON.parse(await response.text()) as AllEvents).events;
    }

    async function getSpecificEvent(code: string) {
        const qualRes = await fetch(
            "https://ftc-api.firstinspires.org/v2.0/2023/schedule/" +
                code +
                "?tournamentLevel=qual",
            {
                method: "GET",
                headers: {
                    Authorization: "Basic " + base64,
                },
            },
        );
        const playoffRes = await fetch(
            "https://ftc-api.firstinspires.org/v2.0/2023/schedule/" +
                code +
                "?tournamentLevel=playoff",
            {
                method: "GET",
                headers: {
                    Authorization: "Basic " + base64,
                },
            },
        );
        specificEvent = {
            code: code,
            qualifiers: (JSON.parse(await qualRes.text()) as MatchesDictionary)[
                "schedule"
            ],
            playoffs: (
                JSON.parse(await playoffRes.text()) as MatchesDictionary
            )["schedule"],
        };
    }

    function submitField() {
        switch (selectedField.val) {
            case BannerFields.topLeft:
                banner.topLeft = submit;
                break;
            case BannerFields.bottomLeft:
                banner.bottomLeft = submit;
                break;
            case BannerFields.centerLeft:
                banner.centerLeft = submit;
                break;
            case BannerFields.centerRight:
                banner.centerRight = submit;
                break;
            case BannerFields.topRight:
                banner.topRight = submit;
                break;
            case BannerFields.bottomRight:
                banner.bottomRight = submit;
                break;
        }
    }

    function submitWithAnd() {
        switch (selectedField.val) {
            case BannerFields.topLeft:
                banner.topLeft = submit + " & " + submitAnd;
                break;
            case BannerFields.bottomLeft:
                banner.bottomLeft = submit + " & " + submitAnd;
                break;
            case BannerFields.centerLeft:
                banner.centerLeft = submit + " & " + submitAnd;
                break;
            case BannerFields.centerRight:
                banner.centerRight = submit + " & " + submitAnd;
                break;
            case BannerFields.topRight:
                banner.topRight = submit + " & " + submitAnd;
                break;
            case BannerFields.bottomRight:
                banner.bottomRight = submit + " & " + submitAnd;
                break;
        }
    }

    function matchDescriptionProcessor(description: string): string[] {
        if (description.includes("Qualification ")) {
            return ["Quals", description.replace("Qualification ", "Match ")];
        } else if (description.includes("Semifinal")) {
            return [
                description
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")
                    .replace("Semifinal", "Semis"),
                description.split(" ").slice(2, 4).join(" "),
            ];
        } else if (description.includes("Final")) {
            return [
                description.split(" ")[0],
                description.split(" ").slice(1, 3).join(" "),
            ];
        }
        return ["", ""];
    }

    function autoloadWelcome() {
        if (eventCode) {
            banner.topLeft = "Welcome";
            banner.bottomLeft =
                allEvents.find((event) => event.code == eventCode)?.venue ||
                "Westwood Robotics";
        }
    }

    function autoloadTeams() {
        if (selectedMatch) {
            banner.topLeft = selectedMatch.teams
                .filter((team) => team.station.includes("Blue"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamNumber)
                .join(" & ");
            banner.bottomLeft = selectedMatch.teams
                .filter((team) => team.station.includes("Blue"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
            banner.centerLeft = matchDescriptionProcessor(
                selectedMatch.description,
            )[0];
            banner.centerRight = matchDescriptionProcessor(
                selectedMatch.description,
            )[1];
            banner.topRight = selectedMatch.teams
                .filter((team) => team.station.includes("Red"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamNumber)
                .join(" & ");
            banner.bottomRight = selectedMatch.teams
                .filter((team) => team.station.includes("Red"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
        }
    }

    function autoloadPendingScores() {
        if (selectedMatch) {
            banner.topLeft = "Pending Scores";
            banner.bottomLeft = selectedMatch.teams
                .filter((team) => team.station.includes("Blue"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
            banner.topRight = selectedMatch.description;
            banner.bottomRight = selectedMatch.teams
                .filter((team) => team.station.includes("Red"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
        }
    }

    function autoloadFinalScores() {
        if (selectedMatch) {
            banner.topLeft = "Final Scores";
            banner.bottomLeft = selectedMatch.teams
                .filter((team) => team.station.includes("Blue"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
            banner.topRight = selectedMatch.description;
            banner.bottomRight = selectedMatch.teams
                .filter((team) => team.station.includes("Red"))
                .toSorted((team0, team1) =>
                    team0.station.localeCompare(team1.station),
                )
                .map((team) => team.teamName)
                .join(" & ");
        }
    }
</script>

<main>
    <br />
    <hr />
    <br />
    <div style="display: flex;">
        <div>
            <label for="topLeft">Top Left: </label>
            <input
                bind:value={banner.topLeft}
                type="text"
                id="topLeft"
                name="topLeft"
            /><br /><br />

            <label for="bottomLeft">Bottom Left: </label>
            <input
                bind:value={banner.bottomLeft}
                type="text"
                id="bottomLeft"
                name="bottomLeft"
            /><br /><br />
        </div>
        <div>
            <label for="centerLeft">Center Left: </label>
            <input
                bind:value={banner.centerLeft}
                type="text"
                id="centerLeft"
                name="centerLeft"
            /><br /><br />
        </div>
        <div>
            <label for="centerRight">Center Right: </label>
            <input
                bind:value={banner.centerRight}
                type="text"
                id="centerRight"
                name="centerRight"
            /><br /><br />
        </div>
        <div>
            <label for="topRight">Top Right: </label>
            <input
                bind:value={banner.topRight}
                type="text"
                id="topRight"
                name="topRight"
            /><br /><br />

            <label for="bottomRight">Bottom Right: </label>
            <input
                bind:value={banner.bottomRight}
                type="text"
                id="bottomRight"
                name="bottomRight"
            /><br /><br />
        </div>
    </div>
    <br />
    <hr />
    <br />

    <div id="selections" style="display: flex;">
        <div>
            <button
                id="topLeftBtn"
                class="selected"
                on:click={() => {
                    selectedField.val = BannerFields.topLeft;
                }}>Top Left</button
            ><br /><br />
            <button
                id="bottomLeftBtn"
                on:click={() => {
                    selectedField.val = BannerFields.bottomLeft;
                }}>Bottom Left</button
            >
        </div>
        <button
            id="centerLeftBtn"
            on:click={() => {
                selectedField.val = BannerFields.centerLeft;
            }}>Center Left</button
        >
        <button
            id="centerRightBtn"
            on:click={() => {
                selectedField.val = BannerFields.centerRight;
            }}>Center Right</button
        >
        <div>
            <button
                id="topRightBtn"
                on:click={() => {
                    selectedField.val = BannerFields.topRight;
                }}>Top Right</button
            ><br /><br />
            <button
                id="bottomRightBtn"
                on:click={() => {
                    selectedField.val = BannerFields.bottomRight;
                }}>Bottom Right</button
            >
        </div>

        <button on:click={submitField} style="margin-left: 0.5em;"
            >Submit</button
        >
        <button on:click={submitWithAnd} style="margin-left: 0.5em;"
            >Submit w/ &</button
        >
        <button on:click={autoloadWelcome} style="margin-left: 0.5em;"
            >Autoload<br />Welcome</button
        >
        <button on:click={autoloadTeams} style="margin-left: 0.5em;"
            >Autoload<br />Teams</button
        >
        <button on:click={autoloadPendingScores} style="margin-left: 0.5em;"
            >Autoload<br />Pending Scores</button
        >
        <button on:click={autoloadFinalScores} style="margin-left: 0.5em;"
            >Autoload<br />Final Scores</button
        >
    </div>
    <br /><br />

    <button
        on:click={async () => {
            await refreshData();
        }}>Refresh</button
    >
    <select bind:value={eventCode} style="margin-left: 0.5em;">
        {#each allEvents as event}
            <option value={event.code}>{event.code + " - " + event.name}</option
            >
        {/each}
    </select>
    <br /><br />

    <button
        on:click={async () => {
            await getSpecificEvent(eventCode);
        }}>Load</button
    >
    <select bind:value={matchType} style="margin-left: 0.5em;">
        {#if specificEvent}
            {#if specificEvent.qualifiers.length > 0}
                <option value="Qualification ">Qualifiers</option>
            {/if}
            {#if specificEvent.playoffs.length > 0}
                <option value="Semifinal">Semifinals</option>
                <option value="Finals ">Finals</option>
            {/if}
        {/if}
    </select>
    <select bind:value={selectedMatch}>
        {#if specificEvent}
            {#each matchType == "Qualification " ? specificEvent.qualifiers : specificEvent.playoffs.filter( (match) => match.description.includes(matchType), ) as match}
                <option value={match}
                    >{match.description.replace(matchType, "")}</option
                >
            {/each}
        {/if}
    </select>
    <select bind:value={submit}>
        {#if selectedMatch}
            <option value={selectedMatch.description}
                >{selectedMatch.description}</option
            >
            {#each selectedMatch.teams.toSorted( (team0, team1) => team0.station.localeCompare(team1.station), ) as team}
                <optgroup label={team.station}>
                    <option value={team.teamNumber}>{team.teamNumber}</option>
                    <option value={team.teamName}>{team.teamName}</option>
                </optgroup><optgroup />
            {/each}
            <optgroup label="Details">
                <option value={selectedMatch.field}
                    >{selectedMatch.field}</option
                >
                <option value={selectedMatch.tournamentLevel}
                    >{selectedMatch.tournamentLevel}</option
                >
                <option value={selectedMatch.startTime}
                    >{selectedMatch.startTime}</option
                >
                <option value={selectedMatch.series}
                    >{selectedMatch.series}</option
                >
                <option value={selectedMatch.matchNumber}
                    >{selectedMatch.matchNumber}</option
                >
                <option value={selectedMatch.modifiedOn}
                    >{selectedMatch.modifiedOn}</option
                >
            </optgroup>
        {/if}
    </select>
    <span> & </span>
    <select bind:value={submitAnd}>
        {#if selectedMatch}
            {#each selectedMatch.teams.toSorted( (team0, team1) => team0.station.localeCompare(team1.station), ) as team}
                <optgroup label={team.station}>
                    <option value={team.teamNumber}>{team.teamNumber}</option>
                    <option value={team.teamName}>{team.teamName}</option>
                </optgroup><optgroup />
            {/each}
        {/if}
    </select><br /><br />
    <hr />
    <br />

    <button on:click={update}>Update</button>
    <button on:click={last} style="margin-left: 0.5em;">Last</button>
    <p><b>UI</b> {uiIp}</p>
    <p><b>Server</b> {serverIp}</p>
    <hr />
</main>
