/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterImage from "../../src/twitter/TwitterImage";
import delayComponentSnapshot from "../testHelpers/delayComponentSnapshot";

import * as determineImageProperties from "../../src/helpers/determineImageProperties";
determineImageProperties.determineImageProperties = jest.fn();

describe( "TwitterImage Component", () => {
	it( "calls determineImageProperties with the correct image URL", () => {
		const imageUrl = "https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg";

		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );

		renderer.create(
			<TwitterImage src={ imageUrl } isLarge={ true } />
		);

		expect( determineImageProperties.determineImageProperties ).toBeCalledWith( imageUrl, "Twitter" );
	} );

	it( "matches the snapshot in the loading state", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce(
			// Make sure the promise is never resolved to keep the loading state.
			new Promise( () => {} )
		);
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" isLarge={ true } />
		);
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot for a landscape image in a summary card", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" isLarge={ false } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a landscape image in a summary-large-image card", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 600,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg" isLarge={ true } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary card", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "square",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" isLarge={ false } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a square image in a summary-large-image card", () => {
		determineImageProperties.determineImageProperties.mockReturnValueOnce( Promise.resolve( {
			mode: "landscape",
			height: 300,
			width: 300,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png" isLarge={ true } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );

	it( "matches the snapshot for a too small image", () => {
		determineImageProperties.determineImageProperties.mockReturnValue( Promise.resolve( {
			mode: "square",
			height: 100,
			width: 100,
		} ) );
		const component = renderer.create(
			<TwitterImage src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" isLarge={ true } />
		);

		// Wait for the determineImageProperties promise to resolve.
		return delayComponentSnapshot( component );
	} );
} );

describe( "retrieveContainerDimensions", () => {
	it( "retrieves the container dimensions for a landscape image", () => {
		const TwitterImageComponent = new TwitterImage();

		const actual = TwitterImageComponent.retrieveContainerDimensions( "landscape" );
		const expected = { height: 254 + "px", width: 506 + "px" };

		expect( actual ).toEqual( expected );
	} );

	it( "retrieves the container dimensions for a square image", () => {
		const TwitterImageComponent = new TwitterImage();

		const actual = TwitterImageComponent.retrieveContainerDimensions( "square" );
		const expected = { height: 125 + "px", width: 125 + "px" };

		expect( actual ).toEqual( expected );
	} );
} );
