
function TransferBodyOut(props) {

    const { idx, player, playerTeam, image } = props
  return ( 
        <div key={idx} className="trans-wrapper">
            <div className="trans small">
                <span>{player.web_name}</span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkred" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                    </svg>
                </span>
            </div>
            <div className="trans-team small">
                <span>{playerTeam}</span>
                <img src={require(`../static/shirt_${image}.webp`)} alt={player.web_name}/>
            </div>
        </div>
  )
}

export default TransferBodyOut