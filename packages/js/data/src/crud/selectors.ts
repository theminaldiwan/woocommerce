/**
 * External dependencies
 */
import createSelector from 'rememo';

/**
 * Internal dependencies
 */
import { getResourceKey, getResourceQuery, possiblyNest } from './utils';
import { getResourceName } from '../utils';
import { IdType, Item, ItemQuery } from './types';
import { ResourceState } from './reducer';
import CRUD_ACTIONS from './crud-actions';

type SelectorOptions = {
	resourceName: string;
	pluralResourceName: string;
	isNested: boolean;
};

export const getItemCreateError = (
	state: ResourceState,
	query: ItemQuery,
	...urlParameters: string[]
) => {
	const itemQuery = getResourceName(
		CRUD_ACTIONS.CREATE_ITEM,
		getResourceQuery( query, urlParameters )
	);
	return state.errors[ itemQuery ];
};

export const getItemDeleteError = (
	state: ResourceState,
	id: IdType,
	...urlParameters: string[]
) => {
	const itemQuery = getResourceName(
		CRUD_ACTIONS.DELETE_ITEM,
		getResourceQuery( { id }, urlParameters )
	);
	return state.errors[ itemQuery ];
};

export const getItem = (
	state: ResourceState,
	id: IdType,
	...urlParameters: string[]
) => {
	const resourceKey = getResourceKey( id, urlParameters );
	return state.data[ resourceKey ];
};

export const getItemError = (
	state: ResourceState,
	id: IdType,
	...urlParameters: string[]
) => {
	const resourceName = getResourceName(
		CRUD_ACTIONS.GET_ITEM,
		getResourceQuery( { id }, urlParameters )
	);
	return state.errors[ resourceName ];
};

export const getItems = createSelector(
	( state: ResourceState, query: ItemQuery, ...urlParameters: string[] ) => {
		const itemQuery = getResourceName(
			CRUD_ACTIONS.GET_ITEMS,
			getResourceQuery( query, urlParameters )
		);

		const ids = state.items[ itemQuery ]
			? state.items[ itemQuery ].data
			: undefined;

		if ( ! ids ) {
			return null;
		}

		if ( query._fields ) {
			return ids.map( ( id: IdType ) => {
				return query._fields.reduce(
					( item: Partial< Item >, field: string ) => {
						return {
							...item,
							[ field ]: state.data[ id ][ field ],
						};
					},
					{} as Partial< Item >
				);
			} );
		}

		return ids.map( ( id: IdType ) => {
			return state.data[ id ];
		} );
	},
	( state, query, urlParameters ) => {
		const itemQuery = getResourceName(
			CRUD_ACTIONS.GET_ITEMS,
			getResourceQuery( query, urlParameters )
		);
		const ids = state.items[ itemQuery ]
			? state.items[ itemQuery ].data
			: undefined;
		return [
			state.items[ itemQuery ],
			...( ids || [] ).map( ( id: string ) => {
				return state.data[ id ];
			} ),
		];
	}
);

export const getItemsError = (
	state: ResourceState,
	query: ItemQuery,
	...urlParameters: string[]
) => {
	const itemQuery = getResourceName(
		CRUD_ACTIONS.GET_ITEMS,
		getResourceQuery( query, urlParameters )
	);
	return state.errors[ itemQuery ];
};

export const getItemUpdateError = (
	state: ResourceState,
	id: IdType,
	...urlParameters: string[]
) => {
	const itemQuery = getResourceName(
		CRUD_ACTIONS.UPDATE_ITEM,
		getResourceQuery( { id }, urlParameters )
	);
	return state.errors[ itemQuery ];
};

export const createSelectors = ( {
	resourceName,
	pluralResourceName,
	isNested,
}: SelectorOptions ) => {
	return {
		[ `get${ resourceName }` ]: possiblyNest( getItem, isNested ),
		[ `get${ resourceName }Error` ]: possiblyNest( getItemError, isNested ),
		[ `get${ pluralResourceName }` ]: possiblyNest( getItems, isNested ),
		[ `get${ pluralResourceName }Error` ]: possiblyNest(
			getItemsError,
			isNested
		),
		[ `get${ resourceName }CreateError` ]: possiblyNest(
			getItemCreateError,
			isNested
		),
		[ `get${ resourceName }DeleteError` ]: possiblyNest(
			getItemDeleteError,
			isNested
		),
		[ `get${ resourceName }UpdateError` ]: possiblyNest(
			getItemUpdateError,
			isNested
		),
	};
};
