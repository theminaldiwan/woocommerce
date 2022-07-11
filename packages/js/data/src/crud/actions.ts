/**
 * External dependencies
 */
import { apiFetch } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import { getRestPath } from './utils';
import CRUD_ACTIONS from './crud-actions';
import TYPES from './action-types';
import { IdType, Item, ItemQuery } from './types';

type ResolverOptions = {
	resourceName: string;
	namespace: string;
	isNested: boolean;
};

export function createItemError( query: Partial< ItemQuery >, error: unknown ) {
	return {
		type: TYPES.CREATE_ITEM_ERROR as const,
		query,
		error,
		errorType: CRUD_ACTIONS.CREATE_ITEM,
	};
}

export function createItemSuccess( id: IdType, item: Item ) {
	return {
		type: TYPES.CREATE_ITEM_SUCCESS as const,
		id,
		item,
	};
}

export function deleteItemError( id: IdType, error: unknown ) {
	return {
		type: TYPES.DELETE_ITEM_ERROR as const,
		id,
		error,
		errorType: CRUD_ACTIONS.DELETE_ITEM,
	};
}

export function deleteItemSuccess( id: IdType, force: boolean, item: Item ) {
	return {
		type: TYPES.DELETE_ITEM_SUCCESS as const,
		id,
		force,
		item,
	};
}

export function getItemError( id: unknown, error: unknown ) {
	return {
		type: TYPES.GET_ITEM_ERROR as const,
		id,
		error,
		errorType: CRUD_ACTIONS.GET_ITEM,
	};
}

export function getItemSuccess( id: IdType, item: Item ) {
	return {
		type: TYPES.GET_ITEM_SUCCESS as const,
		id,
		item,
	};
}

export function getItemsError( query: unknown, error: unknown ) {
	return {
		type: TYPES.GET_ITEMS_ERROR as const,
		query,
		error,
		errorType: CRUD_ACTIONS.GET_ITEMS,
	};
}

export function getItemsSuccess( query: unknown, items: Item[] ) {
	return {
		type: TYPES.GET_ITEMS_SUCCESS as const,
		items,
		query,
	};
}

export function updateItemError( id: unknown, error: unknown ) {
	return {
		type: TYPES.UPDATE_ITEM_ERROR as const,
		id,
		error,
		errorType: CRUD_ACTIONS.UPDATE_ITEM,
	};
}

export function updateItemSuccess( id: IdType, item: Item ) {
	return {
		type: TYPES.UPDATE_ITEM_SUCCESS as const,
		id,
		item,
	};
}

export const createDispatchActions = ( {
	namespace,
	resourceName,
	isNested,
}: ResolverOptions ) => {
	const createItem = function* (
		query: Partial< ItemQuery >,
		...urlParameters: IdType[]
	) {
		try {
			const item: Item = yield apiFetch( {
				path: getRestPath( namespace, query, urlParameters ),
				method: 'POST',
			} );

			yield createItemSuccess( item.id, item );
			return item;
		} catch ( error ) {
			yield createItemError( query, error );
			throw error;
		}
	};

	const deleteItem = function* (
		id: IdType,
		force = true,
		...urlParameters: IdType[]
	) {
		try {
			const item: Item = yield apiFetch( {
				path: getRestPath(
					`${ namespace }/${ id }`,
					{ force },
					urlParameters
				),
				method: 'DELETE',
			} );

			yield deleteItemSuccess( id, force, item );
			return item;
		} catch ( error ) {
			yield deleteItemError( id, error );
			throw error;
		}
	};

	const updateItem = function* (
		id: IdType,
		query: Partial< ItemQuery >,
		...urlParameters: IdType[]
	) {
		try {
			const item: Item = yield apiFetch( {
				path: getRestPath(
					`${ namespace }/${ id }`,
					query,
					urlParameters
				),
				method: 'PUT',
			} );

			yield updateItemSuccess( item.id, item, urlParameters );
			return item;
		} catch ( error ) {
			yield updateItemError( query, error, urlParameters );
			throw error;
		}
	};

	return {
		[ `create${ resourceName }` ]: possiblyNest( createItem, isNested ),
		[ `delete${ resourceName }` ]: possiblyNest( deleteItem, isNested ),
		[ `update${ resourceName }` ]: possiblyNest( updateItem, isNested ),
	};
};

export type Actions = ReturnType<
	| typeof createItemError
	| typeof createItemSuccess
	| typeof deleteItemError
	| typeof deleteItemSuccess
	| typeof getItemError
	| typeof getItemSuccess
	| typeof getItemsError
	| typeof getItemsSuccess
	| typeof updateItemError
	| typeof updateItemSuccess
>;
