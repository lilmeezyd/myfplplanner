const getPicks = (players, picks, curPage, curSize, name) => {
  const returnFIlter = (x, idx) => {
    let start = (curPage - 1) * curSize;
    let end = curPage * curSize;
    if (idx >= start && idx < end) return true;
  };
  const returnSort = (a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
  };
  const returnedPicks = picks.filter(returnFIlter).sort(returnSort);

  if (name === "goalkeeper") {
    const goalkeeper = returnedPicks[0].newPicks
      .filter(
        (goalie) =>
          players.find((x) => x.id === goalie.element).element_type === 1 &&
          goalie.position === 1
      )
      .sort(returnSort);
    return goalkeeper;
  }
  if (name === "defenders") {
    const defenders = returnedPicks[0].newPicks
      .filter(
        (defend) =>
          players.find((x) => x.id === defend.element).element_type === 2 &&
          defend.position < 12
      )
      .sort(returnSort);
    return defenders;
  }
  if (name === "midfielders") {
    const midfielders = returnedPicks[0].newPicks
      .filter(
        (midfield) =>
          players.find((x) => x.id === midfield.element).element_type === 3 &&
          midfield.position < 12
      )
      .sort(returnSort);
    return midfielders;
  }
  if (name === "forwards") {
    const forwards = returnedPicks[0].newPicks
      .filter(
        (forw) =>
          players.find((x) => x.id === forw.element).element_type === 4 &&
          forw.position < 12
      )
      .sort(returnSort);
    return forwards;
  }
  if (name === "benched") {
    const benched = returnedPicks[0].newPicks
      .filter((bench) => bench.position > 11)
      .map((x) => ({ ...x, multiplier: 0 }))
      .sort(returnSort);
    return benched;
  }

  //const itb = returnedPicks[0].bank;
};

export const getGoalKeeper = (players, picks, curPage, curSize) => {
  return getPicks(players, picks, curPage, curSize, "goalkeeper");
};
export const getDefenders = (players, picks, curPage, curSize) => {
  return getPicks(players, picks, curPage, curSize, "defenders");
};
export const getMidfielders = (players, picks, curPage, curSize) => {
  return getPicks(players, picks, curPage, curSize, "midfielders");
};
export const getForwards = (players, picks, curPage, curSize) => {
  return getPicks(players, picks, curPage, curSize, "forwards");
};
export const getBenched = (players, picks, curPage, curSize) => {
  return getPicks(players, picks, curPage, curSize, "benched");
};
