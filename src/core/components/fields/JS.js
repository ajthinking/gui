import React from 'react';

export default class JS extends React.Component {
    render() {
        return (
            <div className="flex flex-col my-4 justify-center align-middle text-gray-500 text-xs font-mono">
				<div className="my-2">
					<div className="">
						{this.props.options.name}
						{this.props.options.description ? ' (' + this.props.options.description + ')' : ''} 
					</div>
					
				</div>
                {/* REPLACE WITH SOME EDITOR! */}
                <textarea
                    onChange={e => {this.props.handleChange(e, this.props.options)}}
                    className="px-2 py-1 rounded h-64"
                    value={this.props.options.value}
                />
            </div>
        );
    }
}