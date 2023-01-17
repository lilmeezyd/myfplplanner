
function Fixtures() {
  return (
    <div className="fixtures-col">
			<h4 className="large fixture-heading">Fixture Ticker</h4>
			<div className="fixture-ticker">
            <div className="next-fixtures">
					<label className="small">Next:</label>
					<select className="custom-select custom-select-next" id="nxt_fixtures">
					</select>
					<span className="small">Fixtures</span>
				</div>
				<table className="ticker-table">
				</table>
			</div>
		</div>
  )
}

export default Fixtures