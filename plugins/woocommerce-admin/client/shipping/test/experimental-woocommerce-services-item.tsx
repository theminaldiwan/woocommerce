/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import { recordEvent } from '@woocommerce/tracks';

/**
 * Internal dependencies
 */
import WooCommerceServicesItem from '../experimental-woocommerce-services-item';
jest.mock( '@woocommerce/tracks', () => ( {
	...jest.requireActual( '@woocommerce/tracks' ),
	recordEvent: jest.fn(),
} ) );

describe( 'WooCommerceServicesItem', () => {
	it( 'should render WCS item with CTA = "Get started" when WCS is not installed', () => {
		render( <WooCommerceServicesItem isWCSInstalled={ false } /> );

		expect(
			screen.queryByText( 'Woocommerce Shipping' )
		).toBeInTheDocument();

		expect(
			screen.queryByRole( 'button', { name: 'Get started' } )
		).toBeInTheDocument();
	} );

	it( 'should render WCS item with CTA = "Activate" when WCS is installed', () => {
		render( <WooCommerceServicesItem isWCSInstalled={ true } /> );

		expect(
			screen.queryByText( 'Woocommerce Shipping' )
		).toBeInTheDocument();

		expect(
			screen.queryByRole( 'button', { name: 'Activate' } )
		).toBeInTheDocument();
	} );

	it( 'should record track when clicking setup button', () => {
		render( <WooCommerceServicesItem isWCSInstalled={ false } /> );

		screen.queryByRole( 'button', { name: 'Get started' } )?.click();
		expect( recordEvent ).toHaveBeenCalledWith( 'tasklist_click', {
			context: 'root/wc-settings',
			task_name: 'shipping-recommendation',
		} );
	} );
} );
