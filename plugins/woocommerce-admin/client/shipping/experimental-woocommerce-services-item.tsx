/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ExternalLink } from '@wordpress/components';
import { Pill } from '@woocommerce/components';
import { getNewPath, navigateTo } from '@woocommerce/navigation';
import { recordEvent } from '@woocommerce/tracks';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './woocommerce-services-item.scss';
import WooIcon from './woo-icon.svg';
import { LayoutContext } from '~/layout';

const WooCommerceServicesItem: React.FC< {
	isWCSInstalled: boolean | undefined;
} > = ( { isWCSInstalled } ) => {
	const layoutContext = useContext( LayoutContext );
	const updatedLayoutContext = useMemo(
		() => layoutContext.getExtendedContext( 'wc-settings' ),
		[ layoutContext ]
	);
	const handleSetupClick = () => {
		recordEvent( 'tasklist_click', {
			task_name: 'shipping-recommendation',
			context: updatedLayoutContext.toString(),
		} );
		navigateTo( {
			url: getNewPath( { task: 'shipping-recommendation' }, '/', {} ),
		} );
	};

	return (
		<div className="woocommerce-list__item-inner woocommerce-services-item">
			<div className="woocommerce-list__item-before">
				<img
					className="woocommerce-services-item__logo"
					src={ WooIcon }
					alt="Woocommerce Service Logo"
				/>
			</div>
			<div className="woocommerce-list__item-text">
				<span className="woocommerce-list__item-title">
					{ __( 'Woocommerce Shipping', 'woocommerce' ) }
					<Pill>{ __( 'Recommended', 'woocommerce' ) }</Pill>
				</span>
				<span className="woocommerce-list__item-content">
					{ __(
						'Print USPS and DHL Express labels straight from your WooCommerce dashboard and save on shipping.',
						'woocommerce'
					) }
					<br />
					<ExternalLink href="https://woocommerce.com/woocommerce-shipping/">
						{ __( 'Learn more', 'woocommerce' ) }
					</ExternalLink>
				</span>
			</div>
			<div className="woocommerce-list__item-after">
				<Button isSecondary onClick={ handleSetupClick }>
					{ isWCSInstalled
						? __( 'Activate', 'woocommerce' )
						: __( 'Get started', 'woocommerce' ) }
				</Button>
			</div>
		</div>
	);
};

export default WooCommerceServicesItem;
