import React from 'react';

import MLPOffset from './MLPOffset';

import './App.css';

const App = () =>
{
	return (
		<main>
			<h1 className="mlp_title">MLP Toolbox</h1>
			<div className="panels">
				<div className="mlp_panel">
					<h1>MLP Editor</h1>
					<div className="mlp_offset_chain">
						<MLPOffset initial={true} />
						<MLPOffset initial={false} />
					</div>
				</div>
				<div className="c_panel">
					<h1>C Code</h1>
					<div className="c_ptr_section">
						<h2>MLP As Pointer</h2>
						<p className="c_ptr">(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a(int*)a</p>
					</div>
					<div className="c_deref_section">
						<h2>Dereferencing MLP</h2>
						<p className="c_deref"></p>
					</div>
				</div>
			</div>
		</main>
	);
}

export default App;