/**
 * External dependencies
 */
import { apiFetch } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import { getRestPath, possiblyNest } from './utils';
import {
	getItemError,
	getItemSuccess,
	getItemsError,
	getItemsSuccess,
} from './actions';
import { request } from '../utils';
import { Item, ItemQuery } from './types';

type ResolverOptions = {
	resourceName: string;
	pluralResourceName: string;
	namespace: string;
	isNested: boolean;
};

export const createResolvers = ( {
	resourceName,
	pluralResourceName,
	namespace,
	isNested,
}: ResolverOptions ) => {
	const getItem = function* ( id: number, ...urlParameters: string[] ) {
		try {
			const item: Item = yield apiFetch( {
				path: getRestPath(
					`${ namespace }/${ id }`,
					{},
					urlParameters
				),
				method: 'GET',
			} );

			yield getItemSuccess( item.id, item );
			return item;
		} catch ( error ) {
			yield getItemError( id, error );
			throw error;
		}
	};

	const getItems = function* (
		query: Partial< ItemQuery >,
		...urlParameters: string[]
	) {
		// Require ID when requesting specific fields to later update the resource data.
		const resourceQuery = { ...query };

		if (
			resourceQuery &&
			resourceQuery._fields &&
			! resourceQuery._fields.includes( 'id' )
		) {
			resourceQuery._fields = [ 'id', ...resourceQuery._fields ];
		}

		try {
			const path = getRestPath( namespace, {}, urlParameters );
			const { items }: { items: Item[] } = yield request<
				ItemQuery,
				Item
			>( path, resourceQuery );

			yield getItemsSuccess( query, items );
			return items;
		} catch ( error ) {
			yield getItemsError( query, error );
			throw error;
		}
	};

	return {
		[ `get${ resourceName }` ]: possiblyNest( getItem, isNested ),
		[ `get${ pluralResourceName }` ]: possiblyNest( getItems, isNested ),
	};
};
