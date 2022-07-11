/**
 * External dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { IdType, ItemQuery } from './types';

export type genericFunction = ( ...args: unknown[] ) => void;
export type genericNestedFunction = (
	parent_id: IdType,
	...args: unknown[]
) => unknown;

export type functionObject = {
	[ key: string ]: unknown;
};

/**
 * Get a REST path given a template path and URL params.
 *
 * @param  templatePath  Path with variable names.
 * @param  query         Item query.
 * @param  urlParameters Array of items to replace in the templatePath.
 * @return string REST path.
 */
export const getRestPath = (
	templatePath: string,
	query: Partial< ItemQuery >,
	urlParameters: IdType[] = []
) => {
	const path = urlParameters.reduce( ( str, param ) => {
		return str.toString().replace( /\{(.*?)}/, param.toString() );
	}, templatePath );
	return addQueryArgs( path.toString(), query );
};

/**
 * Creates a wrapped function that allows prepending a function with the parent ID.
 *
 * @param  fn Function to wrap.
 * @return fn Wrapped function.
 */
export const applyParent = ( fn: genericFunction ) => {
	return ( parent_id: IdType, ...args: unknown[] ) => {
		return fn.apply( null, [ ...args, parent_id ] );
	};
};

/**
 * Adds parent ID to the beginning of all functions in an object.
 *
 * @param  obj Object of actions, resolvers, or selectors.
 * @return obj Object with wrapped functions.
 */
export const applyParentToAll = ( obj: functionObject ) => {
	return Object.keys( obj ).reduce( ( newObj, methodName: string ) => {
		newObj[ methodName ] = applyParent(
			obj[ methodName ] as genericFunction
		);
		return newObj;
	}, {} as functionObject );
};

export const possiblyNest = ( fn: genericFunction, isNested: boolean ) => {
	if ( isNested ) {
		return applyParent( fn );
	}

	return fn;
};

export const getResourceKey = ( id: IdType, urlParameters: string[] = [] ) => {
	if ( ! urlParameters.length ) {
		return id;
	}

	const prefix = urlParameters.join( '/' );

	return `${ prefix }/${ id }`;
};

export const getResourceQuery = (
	query: Partial< ItemQuery >,
	urlParameters: string[]
) => {
	if ( ! urlParameters.length ) {
		return query;
	}

	const resourceQuery = { ...query };
	resourceQuery._urlParameters = urlParameters;
	return resourceQuery;
};
