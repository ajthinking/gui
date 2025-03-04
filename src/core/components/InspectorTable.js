import React from 'react';

export default class InspectorTable extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			truncateAt: 100
		}
	}

    render() {
        return (
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        {this.renderTableHead()}
                        {this.renderTableBody()}
                    </table>
                    {this.getRowCount() == 0 && 
                        <div className="flex w-full justify-center p-24 text-gray-300 font-mono text-xl">
                            No data to show here 😐
                        </div>
                    }
					{this.getRowCount() > this.state.truncateAt &&
						<div
							className="flex cursor-pointer justify-center my-12 px-8 py-2 border text-gray-300 font-mono text-xl"
							onClick={() => {this.setState({truncateAt: Number.POSITIVE_INFINITY})}}>
							Load all {this.getRowCount()} rows
						</div>
					}
                  </div>
                </div>
              </div>
            </div>
        );
    }

    renderTableHead() {
        if(this.hasPrimitiveFeatures()) {
            return (
                <thead>
                    <tr>                        
                        <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            value
                        </th>
                    </tr>
                </thead>
            )
        }

        return (
            <thead>
            <tr>
                {this.getHeaders().map(heading => {
                    return (
                        <th key={heading} scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {heading}
                        </th>
                    )
                })}
            </tr>
          </thead>            
        )
    }

    hasPrimitiveFeatures() {
        return this.props.features.map(f => f.unbox()).filter((content) => {
            return typeof content != 'object'
        }).length != 0;
    }

    renderTableBody() {
        if(this.hasPrimitiveFeatures()) {
            return this.renderPrimitiveTableBody()
        }

        return (
            <tbody>
                {this.getRows().map((row, rowIndex) => {
                    return (
                        <tr key={rowIndex} className="bg-white">
                            {row.map((column, columnIndex) => {
                                return (
                                    <td key={columnIndex} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {column}
                                    </td>                            
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    renderPrimitiveTableBody() {
        return (
            <tbody>
                {this.getRows().map((row, rowIndex) => {
                    return (
                        <tr key={rowIndex} className="bg-white">
                            <td key={rowIndex} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                {row}
                            </td>                            
                        </tr>
                    )
                })}
            </tbody>
        )
    }    

    getHeaders() {
        let keys = this.props.features.map(i => {
            return (typeof i.unbox() === 'object' && i.unbox() != null) ? Object.keys(i.unbox()) : '__default'
        }).flat()

        return [...new Set(keys)];
    }

    getRows() {

        return this.props.features.slice(0, this.state.truncateAt).map(feature => {
            let content = feature.unbox()

            if(typeof content != 'object') return content

            return this.getHeaders().map(header => {

                if(content == null || !content.hasOwnProperty(header)) return 'N/A';

                if(typeof content[header] === 'object') return 'OBJECT';

                if(typeof content[header] === 'array') return 'ARRAY';
    
                return content[header]
            });
        })
    }

	getRowCount() {
		return this.props.features.length
	}
}

