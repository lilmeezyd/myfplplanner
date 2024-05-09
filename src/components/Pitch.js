import { useContext, useState, useEffect, Suspense } from "react";
import { getGameweeks } from "../services/timeService";
import { getPicks } from "../services/picksService";
import { loadOpponents, loadPlayerOpponents } from "../services/fixtureService";
import { BootstrapstaticContext } from "../BootstrapstaticContext";
import SquadPlayer from "./SquadPlayer";
import TransferRows from "./TransferRows";
import Loader from "./Loader";
import prevPage from "../static/chevron_left.png";
import nextPage from "../static/chevron_right.png";
import getTime from "../utils/getTime";
import getPm from "../utils/getPm";

function Pitch(props) {
  const fplElements = useContext(BootstrapstaticContext);
  const events = fplElements.events;
  const teams = fplElements.teams;
  const fixtures = fplElements.fixtures;
  const players = fplElements.players;
  const picks = fplElements.picks;
  const pickIndex = fplElements.pickIndex;
  const playersSelected = fplElements.playersSelected();
  const outplayer = fplElements.outplayer;
  const inplayerOne = fplElements.inplayerOne;
  const playerPosition = fplElements.playerPosition;
  const chips = fplElements.chips;
  const eventId = fplElements.eventId;
  const freehit = fplElements.chips.freehit;
  const { actDeact } = fplElements;
  const curSize = 1;
  const [curPage, setCurPage] = useState(1);
  const gameweeks = getGameweeks(events, curPage, curSize).gameweeks;
  const length = getGameweeks(events, curPage, curSize).length;
  const countdowns = getGameweeks(events, curPage, curSize).countdowns;
  const { getPickIndex } = fplElements;
  const [showTransfersMade, setShowTransfersMade] = useState(false);
  const { handleShow, handleClose, showPop } = props;

  useEffect(() => {
    getPickIndex(curPage);
  }, [curPage, getPickIndex]);

  useEffect(() => {
    let prevBtn = document.getElementById("prevGameweek");
    let nextBtn = document.getElementById("nextGameweek");
    let outKeys = Object.keys(outplayer).length;
    let inKeys = Object.keys(inplayerOne).length;
    if (playersSelected === 15 || outKeys < 0 || inKeys < 0) {
      nextBtn?.removeAttribute("disabled");
      prevBtn?.removeAttribute("disabled");
    }
    if (
      playersSelected < 15 ||
      playersSelected === undefined ||
      outKeys > 0 ||
      inKeys > 0
    ) {
      nextBtn?.setAttribute("disabled", true);
      prevBtn?.setAttribute("disabled", true);
    }
  }, [playersSelected, outplayer, inplayerOne]);

  useEffect(() => {
    let bench = document.getElementById("bench");
    if (chips.bboost.used && chips.bboost.event === +eventId + curPage) {
      bench?.classList.add("bench_boost");
    } else {
      bench?.classList.remove("bench_boost");
    }
  }, [chips, eventId, curPage]);

  useEffect(() => {
    actDeact();
  }, [freehit]);

  const viewNextPage = () => {
    setCurPage((v) => v + 1);
  };
  const viewPreviousPage = () => {
    setCurPage((v) => v - 1);
  };

  const showPlayersOut = () => {
    setShowTransfersMade(!showTransfersMade);
  };

  const setWildCard = (x) => {
    let eventPlayed =
      chips.wildcard.event === x
        ? null
        : chips.wildcard.event === null
        ? x
        : +eventId + curPage;
    let isUsed = chips.wildcard.event === x ? false : true;
    fplElements.updateWildcard(isUsed, eventPlayed);
  };
  const setBenchBoost = (x) => {
    let eventPlayed =
      chips.bboost.event === x
        ? null
        : chips.bboost.event === null
        ? x
        : +eventId + curPage;
    let isUsed = chips.bboost.event === x ? false : true;
    fplElements.updateBboost(isUsed, eventPlayed);
  };
  const setTriple = (x) => {
    let eventPlayed =
      chips.tcap.event === x
        ? null
        : chips.tcap.event === null
        ? x
        : +eventId + curPage;
    let isUsed = chips.tcap.event === x ? false : true;
    fplElements.updateTcap(isUsed, eventPlayed);
  };
  const setFreeHit = (x) => {
    let eventPlayed =
      chips.freehit.event === x
        ? null
        : chips.freehit.event === null
        ? x
        : +eventId + curPage;
    let isUsed = chips.freehit.event === x ? false : true;
    fplElements.updateFreehit(isUsed, eventPlayed);
  };
  const resetGW = () => {
    fplElements.resetGws();
  };

  let pageOneVisible = curPage === 1 ? "hidden" : "visible";
  let lastPageVisible =
    curPage === length || length === 0 ? "hidden" : "visible";
  let wc = chips.wildcard.event === +eventId + curPage && true;
  let tc = chips.tcap.event === +eventId + curPage && true;
  let bb = chips.bboost.event === +eventId + curPage && true;
  let fh = chips.freehit.event === +eventId + curPage && true;

  return (
    <div className="transfers-col">
      {typeof fplElements.managerInfo === "string" ? (
        <div className="message small">The game is being updated.</div>
      ) : (
        <>
          <div>
            <div className="details-one">
              {!!picks.length && (
                <div className="budgetwrapper">
                  <button
                    style={{ visibility: pageOneVisible }}
                    onClick={viewPreviousPage}
                    className="prev_next"
                    id="prevGameweek"
                  >
                    <img src={prevPage} alt="prev_page" />
                  </button>
                  <button
                    style={{ visibility: lastPageVisible }}
                    onClick={viewNextPage}
                    className="small prev_next"
                    id="nextGameweek"
                  >
                    <img src={nextPage} alt="next_page" />
                  </button>
                  <div className="transfer-header">
                    {gameweeks.map((gameweek, idx) => {
                      return (
                        <h3 className="gw-heading" key={idx}>
                          {gameweek}
                        </h3>
                      );
                    })}
                  </div>
                  <div className="matchday-deadline">
                    {gameweeks.map((gameweek, idx) => {
                      return <h4 key={idx}>{gameweek} deadline:</h4>;
                    })}{" "}
                    {length === 0 ? (
                      <p>Season is over!</p>
                    ) : (
                      countdowns.map((countdown, idx) => {
                        return (
                          <p key={idx}>
                            {new Date(countdown).toDateString()}, &nbsp;
                            {getTime(
                              new Date(countdown).toLocaleTimeString("en-US")
                            )}
                            &nbsp;
                            {getPm(
                              new Date(countdown).toLocaleTimeString("en-US")
                            )}
                          </p>
                        );
                      })
                    )}
                  </div>
                  <div className="players-money-select">
                    <div className="vertical"></div>
                    <div className="horizontal"></div>
                    <div className="players-select">
                      <h3 className="select-heading">Players Selected</h3>
                      <div className="players-selected">
                        {fplElements.playersSelected()} / 15
                      </div>
                    </div>
                    <div className="players-money">
                      <h3 className="money-heading">Money Remaining</h3>
                      <div className="money-selected">
                        {!!players.length &&
                          !!picks.length &&
                          !!fixtures.length &&
                          !!events.length &&
                          fplElements.getInTheBank()}
                      </div>
                    </div>
                  </div>
                  <div className="free-cost">
                    <div className="vertical"></div>
                    <div className="horizontal"></div>
                    <div className="free-transfer">
                      <h3 className="free-header">Free Transfers</h3>
                      {eventId === 0 && pickIndex === 1 ? (
                        <span className="free-content">Unlimited</span>
                      ) : (
                        <span className="free-content">
                          {fplElements.playersOut[pickIndex - 1]?.arr.length}
                          &nbsp;/&nbsp;
                          {chips.freehit.event === +eventId + pickIndex ||
                          chips.wildcard.event === +eventId + pickIndex
                            ? "∞"
                            : fplElements.freeTransfers()}
                        </span>
                      )}
                    </div>
                    <div className="cost-transfer">
                      <h3 className="cost-header">TC</h3>
                      <span className="cost-content">
                        {fplElements.transferCost()}
                      </span>
                    </div>
                  </div>
                  <div className="upper-buttons">
                    <div className="fpl-buttons">
                      <button
                        onClick={showPlayersOut}
                        className="btn btn-block show-fpl btn-fpl"
                      >
                        {!showTransfersMade
                          ? "Show Transfers"
                          : "Hide Transfers"}
                      </button>
                    </div>
                    <div className="fpl-buttons">
                      <button
                        onClick={resetGW}
                        className="btn btn-block reset btn-fpl"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showTransfersMade && <TransferRows />}
              {fplElements.playerName && (
                <div
                  className={`message small ${
                    fplElements.playerName && "success"
                  }`}
                >
                  {fplElements.playersIn[curPage - 1].arr && (
                    <span>
                      {fplElements.playerName} has been added to your squad
                    </span>
                  )}
                </div>
              )}
            </div>

            <Suspense fallback={Loader}>
              {!!players.length &&
                !!picks.length &&
                !!fixtures.length &&
                !!events.length && (
                  <div className="field">
                    <div className="pitch">
                      <div className="pitch_row" id="goal" width="pitch">
                        {getPicks(
                          players,
                          picks,
                          curPage,
                          curSize
                        ).goalkeeper.map((playerPos) => {
                          let player = players.find(
                            (x) => x.id === playerPos.element
                          );
                          let teamObj = teams.find((x) => x.id === player.team);
                          let inTemp = fplElements.tempPlayersOut.some(
                            (x) => x.element === playerPos.element
                          );
                          let inplayersIn = fplElements.playersIn[
                            pickIndex - 1
                          ].arr.some((x) => x.element === playerPos.element);
                          let playerInClass = inplayersIn ? "player_in" : "";
                          let positionObj = playerPosition.find(
                            (x) => x.id === player.element_type
                          );
                          let image =
                            positionObj.id === 1 && !inTemp
                              ? `${teamObj.code}_1-66`
                              : positionObj.id >= 1 && !inTemp
                              ? `${teamObj.code}-66`
                              : `0-66`;
                          let news = player.chance_of_playing_next_round;
                          let backgroundColor =
                            news === 0
                              ? "darkred"
                              : news === 25
                              ? "darkorange"
                              : news === 50
                              ? "orange"
                              : news === 75
                              ? "yellow"
                              : "rgba(0,0,55,0.9)";
                          let color =
                            news === 25
                              ? "rgba(0,0,55,0.9)"
                              : news === 50
                              ? "rgba(0,0,55,0.9)"
                              : news === 75
                              ? "rgba(0,0,55,0.9)"
                              : "white";
                          const opponents = loadOpponents(
                            fixtures,
                            events,
                            teamObj.id
                          ).newTeamAandH;
                          const playerOpps = loadPlayerOpponents(
                            opponents,
                            curPage
                          ).playerFix;
                          return (
                            <SquadPlayer
                              image={image}
                              backgroundColor={backgroundColor}
                              color={color}
                              playerOpps={playerOpps}
                              key={player.id}
                              player={player}
                              teams={teams}
                              playerPos={playerPos}
                              positionObj={positionObj}
                              playerInClass={playerInClass}
                              curPage={curPage}
                              handleShow={handleShow}
                              handleClose={handleClose}
                              showPop={showPop}
                            ></SquadPlayer>
                          );
                        })}
                      </div>

                      <div className="pitch_row" id="defend" width="pitch">
                        {getPicks(
                          players,
                          picks,
                          curPage,
                          curSize
                        ).defenders.map((playerPos) => {
                          let player = players.find(
                            (x) => x.id === playerPos.element
                          );
                          let teamObj = teams.find((x) => x.id === player.team);
                          let positionObj = playerPosition.find(
                            (x) => x.id === player.element_type
                          );
                          let inTemp = fplElements.tempPlayersOut.some(
                            (x) => x.element === playerPos.element
                          );
                          let inplayersIn = fplElements.playersIn[
                            pickIndex - 1
                          ].arr.some((x) => x.element === playerPos.element);
                          let playerInClass = inplayersIn ? "player_in" : "";
                          let image =
                            positionObj.id === 1 && !inTemp
                              ? `${teamObj.code}_1-66`
                              : positionObj.id >= 1 && !inTemp
                              ? `${teamObj.code}-66`
                              : `0-66`;
                          let news = player.chance_of_playing_next_round;
                          let backgroundColor =
                            news === 0
                              ? "darkred"
                              : news === 25
                              ? "darkorange"
                              : news === 50
                              ? "orange"
                              : news === 75
                              ? "yellow"
                              : "rgba(0,0,55,0.9)";
                          let color =
                            news === 25
                              ? "rgba(0,0,55,0.9)"
                              : news === 50
                              ? "rgba(0,0,55,0.9)"
                              : news === 75
                              ? "rgba(0,0,55,0.9)"
                              : "white";
                          const opponents = loadOpponents(
                            fixtures,
                            events,
                            teamObj.id
                          ).newTeamAandH;
                          const playerOpps = loadPlayerOpponents(
                            opponents,
                            curPage
                          ).playerFix;
                          return (
                            <SquadPlayer
                              image={image}
                              backgroundColor={backgroundColor}
                              color={color}
                              playerOpps={playerOpps}
                              key={player.id}
                              player={player}
                              teams={teams}
                              playerPos={playerPos}
                              positionObj={positionObj}
                              playerInClass={playerInClass}
                              curPage={curPage}
                              handleShow={handleShow}
                              handleClose={handleClose}
                              showPop={showPop}
                            ></SquadPlayer>
                          );
                        })}
                      </div>

                      <div className="pitch_row" id="mid" width="pitch">
                        {getPicks(
                          players,
                          picks,
                          curPage,
                          curSize
                        ).midfielders.map((playerPos) => {
                          let player = players.find(
                            (x) => x.id === playerPos.element
                          );
                          let teamObj = teams.find((x) => x.id === player.team);
                          let positionObj = playerPosition.find(
                            (x) => x.id === player.element_type
                          );
                          let inTemp = fplElements.tempPlayersOut.some(
                            (x) => x.element === playerPos.element
                          );
                          let inplayersIn = fplElements.playersIn[
                            pickIndex - 1
                          ].arr.some((x) => x.element === playerPos.element);
                          let playerInClass = inplayersIn ? "player_in" : "";
                          let image =
                            positionObj.id === 1 && !inTemp
                              ? `${teamObj.code}_1-66`
                              : positionObj.id >= 1 && !inTemp
                              ? `${teamObj.code}-66`
                              : `0-66`;
                          let news = player.chance_of_playing_next_round;
                          let backgroundColor =
                            news === 0
                              ? "darkred"
                              : news === 25
                              ? "darkorange"
                              : news === 50
                              ? "orange"
                              : news === 75
                              ? "yellow"
                              : "rgba(0,0,55,0.9)";
                          let color =
                            news === 25
                              ? "rgba(0,0,55,0.9)"
                              : news === 50
                              ? "rgba(0,0,55,0.9)"
                              : news === 75
                              ? "rgba(0,0,55,0.9)"
                              : "white";
                          const opponents = loadOpponents(
                            fixtures,
                            events,
                            teamObj.id
                          ).newTeamAandH;
                          const playerOpps = loadPlayerOpponents(
                            opponents,
                            curPage
                          ).playerFix;
                          return (
                            <SquadPlayer
                              image={image}
                              backgroundColor={backgroundColor}
                              color={color}
                              playerOpps={playerOpps}
                              key={player.id}
                              player={player}
                              teams={teams}
                              playerPos={playerPos}
                              positionObj={positionObj}
                              playerInClass={playerInClass}
                              curPage={curPage}
                              handleShow={handleShow}
                              handleClose={handleClose}
                              showPop={showPop}
                            ></SquadPlayer>
                          );
                        })}
                      </div>

                      <div className="pitch_row" id="forw" width="pitch">
                        {getPicks(
                          players,
                          picks,
                          curPage,
                          curSize
                        ).forwards.map((playerPos) => {
                          let player = players.find(
                            (x) => x.id === playerPos.element
                          );
                          let teamObj = teams.find((x) => x.id === player.team);
                          let positionObj = playerPosition.find(
                            (x) => x.id === player.element_type
                          );
                          let inTemp = fplElements.tempPlayersOut.some(
                            (x) => x.element === playerPos.element
                          );
                          let inplayersIn = fplElements.playersIn[
                            pickIndex - 1
                          ].arr.some((x) => x.element === playerPos.element);
                          let playerInClass = inplayersIn ? "player_in" : "";
                          let image =
                            positionObj.id === 1 && !inTemp
                              ? `${teamObj.code}_1-66`
                              : positionObj.id >= 1 && !inTemp
                              ? `${teamObj.code}-66`
                              : `0-66`;
                          let news = player.chance_of_playing_next_round;
                          let backgroundColor =
                            news === 0
                              ? "darkred"
                              : news === 25
                              ? "darkorange"
                              : news === 50
                              ? "orange"
                              : news === 75
                              ? "yellow"
                              : "rgba(0,0,55,0.9)";
                          let color =
                            news === 25
                              ? "rgba(0,0,55,0.9)"
                              : news === 50
                              ? "rgba(0,0,55,0.9)"
                              : news === 75
                              ? "rgba(0,0,55,0.9)"
                              : "white";
                          const opponents = loadOpponents(
                            fixtures,
                            events,
                            teamObj.id
                          ).newTeamAandH;
                          const playerOpps = loadPlayerOpponents(
                            opponents,
                            curPage
                          ).playerFix;
                          return (
                            <SquadPlayer
                              image={image}
                              backgroundColor={backgroundColor}
                              color={color}
                              playerOpps={playerOpps}
                              key={player.id}
                              player={player}
                              teams={teams}
                              playerPos={playerPos}
                              positionObj={positionObj}
                              playerInClass={playerInClass}
                              curPage={curPage}
                              handleShow={handleShow}
                              handleClose={handleClose}
                              showPop={showPop}
                            ></SquadPlayer>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pitch_row bench" id="bench">
                      {getPicks(players, picks, curPage, curSize).benched.map(
                        (playerPos, idx) => {
                          let player = players.find(
                            (x) => x.id === playerPos.element
                          );
                          let teamObj = teams.find((x) => x.id === player.team);
                          let positionObj = playerPosition.find(
                            (x) => x.id === player.element_type
                          );
                          let inTemp = fplElements.tempPlayersOut.some(
                            (x) => x.element === playerPos.element
                          );
                          let inplayersIn = fplElements.playersIn[
                            pickIndex - 1
                          ].arr.some((x) => x.element === playerPos.element);
                          let playerInClass = inplayersIn ? "player_in" : "";
                          let image =
                            positionObj.id === 1 && !inTemp
                              ? `${teamObj.code}_1-66`
                              : positionObj.id >= 1 && !inTemp
                              ? `${teamObj.code}-66`
                              : `0-66`;
                          let news = player.chance_of_playing_next_round;
                          let backgroundColor =
                            news === 0
                              ? "darkred"
                              : news === 25
                              ? "darkorange"
                              : news === 50
                              ? "orange"
                              : news === 75
                              ? "yellow"
                              : "rgba(0,0,55,0.9)";
                          let color =
                            news === 25
                              ? "rgba(0,0,55,0.9)"
                              : news === 50
                              ? "rgba(0,0,55,0.9)"
                              : news === 75
                              ? "rgba(0,0,55,0.9)"
                              : "white";
                          const opponents = loadOpponents(
                            fixtures,
                            events,
                            teamObj.id
                          ).newTeamAandH;
                          const playerOpps = loadPlayerOpponents(
                            opponents,
                            curPage
                          ).playerFix;
                          return (
                            <SquadPlayer
                              image={image}
                              backgroundColor={backgroundColor}
                              color={color}
                              playerOpps={playerOpps}
                              key={player.id}
                              player={player}
                              teams={teams}
                              playerPos={playerPos}
                              positionObj={positionObj}
                              playerInClass={playerInClass}
                              curPage={curPage}
                              handleShow={handleShow}
                              handleClose={handleClose}
                              showPop={showPop}
                            ></SquadPlayer>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
            </Suspense>
          </div>
          <div className="message small">
            {chips.wildcard.event === +eventId + curPage
              ? "Wildcard Active"
              : chips.bboost.event === +eventId + curPage
              ? "Bench Boost Active"
              : chips.freehit.event === +eventId + curPage
              ? "Freehit Active"
              : chips.tcap.event === +eventId + curPage
              ? "Triple Captain Active"
              : ""}
          </div>
          {!!picks.length && (
            <div id="chip-tab" className="chip-buttons button-item">
              {eventId === 0 && pickIndex === 1 ? (
                ""
              ) : (
                <div className="chip">
                  <h6>Wildcard</h6>
                  <div className="div-wrapper">
                    <button
                      onClick={() => setWildCard(+eventId + curPage)}
                      disabled={
                        ((chips.wildcard.used &&
                          +chips.wildcard.event < +eventId + curPage) ||
                          fh ||
                          tc ||
                          bb) &&
                        true
                      }
                      style={{
                        opacity:
                          chips.wildcard.used &&
                          +chips.wildcard.event < +eventId + curPage &&
                          0.5,
                        background:
                          +chips.wildcard.event === +eventId + curPage
                            ? "rgb(22, 22, 68)"
                            : (chips.wildcard.used &&
                                +chips.wildcard.event < +eventId + curPage) ||
                              fh ||
                              tc ||
                              bb
                            ? "white"
                            : "",
                        color:
                          +chips.wildcard.event === +eventId + curPage &&
                          "white",
                      }}
                      className="btn btn-block btn-chip small"
                      id="wcard"
                    >
                      {+chips.wildcard.event < +eventId + curPage &&
                      chips.wildcard.event !== null
                        ? `PLAYED GW${chips.wildcard.event}`
                        : +chips.wildcard.event === +eventId + curPage
                        ? "ACTIVE"
                        : "PLAY"}
                    </button>
                  </div>
                </div>
              )}
              <div className="chip">
                <h6>Bench Boost</h6>
                <div className="div-wrapper">
                  <button
                    onClick={() => setBenchBoost(+eventId + curPage)}
                    disabled={
                      ((chips.bboost.used &&
                        +chips.bboost.event < +eventId + curPage) ||
                        wc ||
                        fh ||
                        tc) &&
                      true
                    }
                    style={{
                      opacity:
                        chips.bboost.used &&
                        +chips.bboost.event < +eventId + curPage &&
                        0.5,
                      background:
                        +chips.bboost.event === +eventId + curPage
                          ? "rgb(22, 22, 68)"
                          : (chips.bboost.used &&
                              +chips.bboost.event < +eventId + curPage) ||
                            wc ||
                            fh ||
                            tc
                          ? "white"
                          : "",
                      color:
                        +chips.bboost.event === +eventId + curPage && "white",
                    }}
                    className="btn btn-block btn-chip small"
                    id="bbench"
                  >
                    {+chips.bboost.event < +eventId + curPage &&
                    chips.bboost.event !== null
                      ? `PLAYED GW${chips.bboost.event}`
                      : +chips.bboost.event === +eventId + curPage
                      ? "ACTIVE"
                      : "PLAY"}
                  </button>
                </div>
              </div>
              <div className="chip">
                <h6>Triple Captain</h6>
                <div className="div-wrapper">
                  <button
                    onClick={() => setTriple(+eventId + curPage)}
                    disabled={
                      ((chips.tcap.used &&
                        +chips.tcap.event < +eventId + curPage) ||
                        wc ||
                        fh ||
                        bb) &&
                      true
                    }
                    style={{
                      opacity:
                        chips.tcap.used &&
                        +chips.tcap.event < +eventId + curPage &&
                        0.5,
                      background:
                        +chips.tcap.event === +eventId + curPage
                          ? "rgb(22, 22, 68)"
                          : (chips.tcap.used &&
                              +chips.tcap.event < +eventId + curPage) ||
                            wc ||
                            fh ||
                            bb
                          ? "white"
                          : "",
                      color:
                        +chips.tcap.event === +eventId + curPage && "white",
                    }}
                    className="btn btn-block btn-chip small"
                    id="tcap"
                  >
                    {+chips.tcap.event < +eventId + curPage &&
                    chips.tcap.event !== null
                      ? `PLAYED GW${chips.tcap.event}`
                      : +chips.tcap.event === +eventId + curPage
                      ? "ACTIVE"
                      : "PLAY"}
                  </button>
                </div>
              </div>
              {eventId === 0 && pickIndex === 1 ? (
                ""
              ) : (
                <div className="chip">
                  <h6>FreeHit</h6>
                  <div className="div-wrapper">
                    <button
                      onClick={() => setFreeHit(+eventId + curPage)}
                      disabled={
                        ((chips.freehit.used &&
                          +chips.freehit.event < +eventId + curPage) ||
                          bb ||
                          wc ||
                          tc) &&
                        true
                      }
                      style={{
                        opacity:
                          chips.freehit.used &&
                          +chips.freehit.event < +eventId + curPage &&
                          0.5,
                        background:
                          +chips.freehit.event === +eventId + curPage
                            ? "rgb(22, 22, 68)"
                            : (chips.freehit.used &&
                                +chips.freehit.event < +eventId + curPage) ||
                              bb ||
                              wc ||
                              tc
                            ? "white"
                            : "",
                        color:
                          +chips.freehit.event === +eventId + curPage &&
                          "white",
                      }}
                      className="btn btn-block btn-chip small"
                      id="fhit"
                    >
                      {+chips.freehit.event < +eventId + curPage &&
                      chips.freehit.event !== null
                        ? `PLAYED GW${chips.freehit.event}`
                        : +chips.freehit.event === +eventId + curPage
                        ? "ACTIVE"
                        : "PLAY"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Pitch;
