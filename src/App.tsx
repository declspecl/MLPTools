import React from 'react';

import './App.css';
import './MLPPanel.css';
import './CPanel.css';

interface CodeComponent
{
	variableName: string,
	value: string
};

interface Props
{

};

interface State
{
	offsetValues: Array<string>,
	cCode: string,
	codeComponents: Array<CodeComponent>
};

class App extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state =
		{
			offsetValues: new Array<string>(),
			cCode: "",
			codeComponents: new Array<CodeComponent>()
		};

		this.updateCCode = this.updateCCode.bind(this);
	}

	getCurrentOffsetValues(): Array<string>
	{
		const offsetValues = new Array<string>();

		for (let element of document.getElementsByClassName("mlp_offset_input") as HTMLCollectionOf<HTMLInputElement>)
		{
			offsetValues.push(element.value);
		}

		return offsetValues;
	}

	updateCCode(): void
	{
		const type: string = (document.getElementById("mlp_type") as HTMLSelectElement).value;
		
		let initial_address_string: string = (document.getElementById("mlp_initial_address") as HTMLInputElement).value;
		if (!initial_address_string.startsWith("0x"))
		{
			initial_address_string = "0x".concat(initial_address_string);
		}

		const initial: number = parseInt(initial_address_string);

		if (isNaN(initial))
		{
			(document.getElementById("mlp_error") as HTMLElement).setAttribute("style", "display: block;");

			return;
		}
		else
		{
			(document.getElementById("mlp_error") as HTMLElement).setAttribute("style", "display: none;");
		}

		const currentOffsetValues: Array<string> = this.getCurrentOffsetValues();

		let prev_addr: string =  initial_address_string;
		let final_code: string = type + "* initialAddress = (" + type + "*)" + prev_addr + ";\n"

		const codeComponents = [{variableName: "initialAddress", value: initial_address_string}];

		for (let i: number = 0; i < currentOffsetValues.length; i++)
		{
			if (!currentOffsetValues[i].startsWith("0x"))
			{
				currentOffsetValues[i] = "0x".concat(currentOffsetValues[i]);
			}
			const offset_val: number = parseInt(currentOffsetValues[i]);
			
			if (isNaN(offset_val))
			{
				(document.getElementById("mlp_error") as HTMLElement).setAttribute("style", "display: block;");

				return;
			}

			let asterisks = "";

			for (let j = 0; j < i + 2; j++)
			{
				asterisks += "*";
			}

			let variableName = "";
			let value = "";

			if (i === currentOffsetValues.length - 1)
			{
				variableName = "mlpHead";

				let prev = "";

				if (i === 0)
				{
					prev = "((char*)initialAddress + " + currentOffsetValues[i] + ")";

					value = "initialAddress + " + currentOffsetValues[i]
				}
				else
				{
					prev = "((char*)offset" + (currentOffsetValues.length - i) + " + " + currentOffsetValues[i] + ")";

					value = "offset" + (currentOffsetValues.length - i) + " + " + currentOffsetValues[i];
				}

				final_code += type + asterisks + " mlpHead = (" + type + asterisks + ")" + prev + ";\n";
			}
			else
			{
				variableName = "offset" + (currentOffsetValues.length - i - 1)

				let prev = "";

				if (i === 0)
				{
					prev = "((char*)initialAddress + " + currentOffsetValues[i] + ")";

					value = "initialAddress + " + currentOffsetValues[i];
				}
				else
				{
					prev = "((char*)offset" + (currentOffsetValues.length - i) + " + " + currentOffsetValues[i] + ")";

					value = "offset" + (currentOffsetValues.length - i) + " + " + currentOffsetValues[i];
				}

				final_code += type + asterisks + " " + variableName + " = (" + type + asterisks + ")" + prev + ";\n";
			}

			codeComponents.push({variableName, value});
		}

		this.setState(
		{
			cCode: final_code,
			codeComponents: codeComponents
		});
	}

	render(): JSX.Element
	{
		const offsets: Array<JSX.Element> = this.state.offsetValues.map((value, index) =>
		{
			return (
				<div className="mlp_offset" key={"offset_" + index}>
					<input type="text" placeholder="Offset" className="mlp_offset_input" defaultValue={value} onChange={this.updateCCode} />
				</div>
			);
		});

		const type_regex = /(int32_t|int64_t|uint32_t|uint64_t|float|double|char|void)/;
		const delimeter_regex = /(\*|=|;)/;
		const number_regex = /(0x)[a-z0-9]+/;
		const all_regex = /(int32_t|int64_t|uint32_t|uint64_t|float|double|char|void|\*|=|;)/;
  
		// Split the code string into an array of substrings using the regex pattern
		const code_groups = this.state.cCode.split(all_regex);
		
		// Map over the array and wrap each matched substring in a <span> tag
		const highlighted_code: Array<JSX.Element> = code_groups.map((substring, index) =>
		{
			if (type_regex.test(substring))
			{
				return <span key={"type_" + index} className="c_code_type">{substring}</span>;
			}
			if (number_regex.test(substring))
			{
				return <span key={"num_" + index} className="c_code_num">{substring}</span>;
			}
			else if (delimeter_regex.test(substring))
			{
				return <span key={"delimiter_" + index} className="c_code_delimeter">{substring}</span>;
			}
			else
			{
				return <React.Fragment key={"no_matches_" + index}>{substring}</React.Fragment>
			}
		});

		const mlpGraph: Array<JSX.Element> = new Array<JSX.Element>();
		
		for (let i: number = 0; i < this.state.codeComponents.length; i++)
		{
			mlpGraph.push(
				<>
					<div className="mlp_graph_component" key={"graph_component" + i}>
						<p className="mlp_variable_name">{this.state.codeComponents[i].variableName}</p>
						<p className="mlp_variable_name">{this.state.codeComponents[i].value}</p>
					</div>
					{ (i < this.state.codeComponents.length - 1) ? <div className="mlp_graph_arrow">↑</div> : null}
				</>
			)
		};

		return (
			<main>
				<h1 className="main_title">MLP Tools</h1>
				<div className="panels">
					<div className="mlp_panel">
						<h1>MLP Editor</h1>
						<div className="mlp_offset_chain">
							<div id="mlp_initial">
								<input type="text" placeholder="Initial Address" id="mlp_initial_address" onChange={this.updateCCode}></input>
								<select id="mlp_type" onChange={this.updateCCode}>
									<option value="int32_t">int32</option>
									<option value="int64_t">int64</option>
									<option value="uint32_t">uint32</option>
									<option value="uint64_t">uint64</option>
									<option value="float">float</option>
									<option value="double">double</option>
									<option value="char">char</option>
									<option value="void">other</option>
								</select>
							</div>
							{offsets}
						</div>
						<p id="mlp_error">There is an error in your addresses. Only input numbers in hexadecimal format.</p>
						<div className="mlp_buttons">
							<button type="button" className="mlp_offset_button" onClick={() =>
							{
								this.setState(
								{
									offsetValues: this.getCurrentOffsetValues().concat([""])
								});
							}}>Add offset</button>
							<button className="mlp_offset_button" onClick={() =>
							{
								const currentOffsetValues: Array<string> = this.getCurrentOffsetValues();
								this.setState(
								{
									offsetValues: currentOffsetValues.slice(0, currentOffsetValues.length - 1)
								});
								this.forceUpdate(() => { this.updateCCode() });
							}}>Delete offset</button>
						</div>
					</div>
					<div className="c_panel">
						<h1>Information</h1>
						<div className="c_ptr_section">
							<h2>MLP As C Pointer</h2>
							<p className="c_ptr">{highlighted_code}</p>
						</div>
						<div className="mlp_graph_section">
							<h2>MLP Graph</h2>
							<div className="mlp_graph">
								{mlpGraph}
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export default App;