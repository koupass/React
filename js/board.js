var Board = React.createClass({
	propTypes:{
		counts: function(props,propName){
			if(typeof props[propName] !== "number"){
				return new Error('The count property must be a number!');
			}
			if(props[propName] > 100){
				return new Error('Creatng more than '+props[propName]+' notes is not a  good idea!');
			}
		}
	},
	getInitialState: function(){
		return {
			notes:[
				"Call Admin","Email master", "get DOg Food"
			]
		};
	},
	render: function(){
		return (
			<div className="board">
				{
					this.state.notes.map(function(note, i){
						return (<Note key={i}>{note}</Note>);
				})}
			</div>
		);
	}
});

ReactDOM.render(<Board count={10} /> , document.getElementById("board-container"));	