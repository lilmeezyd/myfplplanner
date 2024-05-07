import { useContext } from "react";
import { BootstrapstaticContext } from "../BootstrapstaticContext";
import TeamRowOpponents from "./TeamRowOpponents";
import { loadOpponents } from "../services/fixtureService";

function TeamRow(props) {
  const { team, gws, start } = props;
  const fplElements = useContext(BootstrapstaticContext);
  const events = fplElements.events;
  const teams = fplElements.teams;
  const fixtures = fplElements.fixtures;
  const opponents = loadOpponents(
    fixtures,
    events,
    team.id,
    gws,
    start
  ).newTeamAandH;
  return (
    <tr>
      <td>
        <div className="team-row">
          <span className="ticker-image">
            <img src={require(`../static/t${team.code}.png`)} alt={team.name} />
          </span>
          <span className="ticker-team">{team.name}</span>
        </div>
      </td>
      {opponents.map((cell) => (
        <td key={cell.event}>
          <div className="oppfix">
            {cell.arr.map((x, idx) => (
              <TeamRowOpponents
                key={x.opponent}
                color={
                  x.difficulty === 4 || x.difficulty === 5
                    ? "rgb(255,255,255)"
                    : "rgb(0,0,0)"
                }
                backgroundColor={
                  x.difficulty === 2
                    ? "rgb(1, 252, 122)"
                    : x.difficulty === 3
                    ? "rgb(231, 231, 231)"
                    : x.difficulty === 4
                    ? "rgb(255, 23, 81)"
                    : x.difficulty === 5
                    ? "rgb(128, 7, 45)"
                    : "rgb(0,0,0)"
                }
                name={
                  x.opponent > 0
                    ? teams.filter((y) => y.id === x.opponent)[0].short_name
                    : ""
                }
                venue={x.venue}
              />
            ))}
          </div>
        </td>
      ))}
    </tr>
  );
}

export default TeamRow;
