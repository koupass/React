var Note = React.createClass({
	getInitialState: function(){
		return { editing: false }
	},
	componentWillMount: function(){
		this.style = {
			right      : this.randomBetween(0, window.innerWidth - 150)+ 'px',
			top        : this.randomBetween(0, window.innerHeight - 150)+ 'px',
			transform  : 'rotate('+ this.randomBetween(-15, 15)+'deg)'
		};
	},
	componentDidMount: function(){
		$(ReactDOM.findDOMNode(this)).draggable();
	},
	randomBetween: function(min, max){
		console.log([min, max]);
		var val =min + Math.ceil(Math.random()* max);
		console.log(val);
		return ( val);
	},
	edit: function(){
		this.setState({editing: true });
	},
	save: function(){
		this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
		this.setState({ editing: false });
	},
	remove: function(i){		
		this.props.onRemove(this.props.index);
	},
	renderDisplay: function(){
		return (
		<div className="note" style={this.style}>
			<p>{this.props.children}</p>
			<span>
				<button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil"/>
				<button onClick={this.remove} className="btn btn-danger glyphicon glyphicon-trash"/>
			</span>
		</div>
		);
	},	
	renderForm: function(){
		return(
		
			<div className="note" style={this.style}>
				<textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
				<button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
				
			</div>
		
		);
	},
	render: function(){
		if(this.state.editing){
			return this.renderForm();
		}else{
			return this.renderDisplay();
		}
	} 
});

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
			notes:[]
		};
	},
	nextId: function(){
		this.uniqueId = this.uniqueId || 0;
		return this.uniqueId++;
	},
	componentWillMount: function(){
		// A function to create some notes automatically- the api is not accessible without VPN.
		var self = this;
		if(this.props.count){
			$.getJSON("http://baconipsum.com/api/?type=all-meat&sentences="+
		this.props.count+ "&start-with-lorem=1&callback=?", function(results){
			results[0].split('. ').forEach(function(sentence){
				self.add(sentence.substring(0, 40));
			});
		});
		}
	},
	add: function(text){
		
		var arr = this.state.notes;
		arr.push({
			id   : this.nextId(),
			note : text
		});
		this.setState({notes:arr});
	},
	remove: function(i){		
		var arr = this.state.notes;
		arr.splice(i, 1);
		this.setState({notes:arr});
	},
	update: function(newText,i){
		var arr = this.state.notes;
		arr[i].note = newText;
		this.setState({notes:arr});
	},
	eachNote: function(note, i){
		
		return (
			<Note key={note.id}
				  index={i}
				  onChange={this.update}
				  onRemove={this.remove}
			
			>
				{note.note}
			</Note>
		);
	},
	render: function(){
		return (
			<div className="board">
				{this.state.notes.map(this.eachNote)}
				<button onClick={this.add.bind(null,"new Note")} className="btn glyphicon glyphicon-plus" />
			</div>
		);
	}
});

ReactDOM.render(<Board count={10} /> , document.getElementById("board-container"));	
