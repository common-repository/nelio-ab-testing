/**
 * External dependencies
 */
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const path = require( 'path' );
const { upperFirst } = require( 'lodash' );
const _ = require( 'lodash' );

const camelCase = ( s ) =>
	`A${ s }`.split( '-' ).map( upperFirst ).join( '' ).substring( 1 );
const kebabCase = ( s ) => s.replace( /([A-Z])/g, '-$1' ).toLowerCase();

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * Internal dependencies
 */
const { dependencies } = require( './package' );

const NAB_NAMESPACE = '@nab/';
const nabPackages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( NAB_NAMESPACE ) )
	.map( ( packageName ) => packageName.replace( NAB_NAMESPACE, '' ) )
	.filter( ( packageName ) => 'types' !== packageName );

// =======
// PLUGINS
// =======

const dewp = new DependencyExtractionWebpackPlugin( {
	requestToExternal: ( request ) =>
		request.startsWith( NAB_NAMESPACE )
			? [ 'nab', camelCase( request.replace( NAB_NAMESPACE, '' ) ) ]
			: undefined,
	requestToHandle: ( request ) =>
		request.startsWith( NAB_NAMESPACE )
			? 'nab-' + request.replace( NAB_NAMESPACE, '' )
			: undefined,
	outputFormat: 'php',
} );

// ========
// SETTINGS
// ========
const __hackFilterOutSVGRulesNOTE = ( rules ) =>
	rules.filter(
		( { use } ) =>
			! ( use && use.includes && use.includes( '@svgr/webpack' ) )
	);

const config = {
	...defaultConfig,
	resolve: {
		alias: {
			'@safe-wordpress': path.resolve(
				__dirname,
				'packages/safe-wordpress'
			),
			'admin-stylesheets': path.resolve(
				'./assets/src/admin/stylesheets'
			),
		},
		extensions: _.uniq( [
			...( defaultConfig.resolve.extensions ?? [] ),
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		] ),
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		...defaultConfig.plugins
			.filter( ( p ) => 'RtlCssPlugin' !== p.constructor.name )
			.map( ( p ) => {
				switch ( p.constructor.name ) {
					case 'DependencyExtractionWebpackPlugin':
						return dewp;

					case 'MiniCssExtractPlugin':
						return new p.constructor( {
							filename: ( { chunk } ) =>
								`css/${ kebabCase(
									chunk.name.replace( 'style-', '' )
								) }.css`,
						} );

					default:
						return p;
				}
			} ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: './assets/src/images',
					to: 'images',
				},
			],
		} ),
	].filter( /* if plugin exists */ ( x ) => !! x ),
	module: {
		...defaultConfig.module,
		rules: [
			...__hackFilterOutSVGRulesNOTE( defaultConfig.module.rules ),
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /.svg$/,
				issuer: /\.tsx?$/,
				loader: '@svgr/webpack',
			},
		],
	},
	watchOptions: {
		ignored: /node_modules|^((?!(packages|assets.src|includes.hooks)).)*$/,
	},
};

const pagePrefix = './assets/src/admin/pages';
const pages = {
	'account-page': `${ pagePrefix }/account`,
	'experiment-list-page': `${ pagePrefix }/experiment-list`,
	'heatmap-results-page': `${ pagePrefix }/heatmap-results`,
	'overview-page': `${ pagePrefix }/overview`,
	'plugin-list-page': `${ pagePrefix }/plugin-list`,
	'recordings-page': `${ pagePrefix }/recordings`,
	'results-page': `${ pagePrefix }/results`,
	'settings-page': `${ pagePrefix }/settings`,
	'welcome-page': `${ pagePrefix }/welcome`,
	'individual-settings': `${ pagePrefix }/settings/individual-settings`,
};

const scripts = {
	'css-experiment-admin': './includes/hooks/experiments/css/assets/admin',
	'css-experiment-public': './includes/hooks/experiments/css/assets/public',
	'css-selector-finder': './assets/src/admin/scripts/css-selector-finder',
	'heatmap-renderer': './assets/src/admin/scripts/heatmap-renderer',
	'experiment-previewer': './assets/src/admin/scripts/experiment-previewer',
	'javascript-experiment-admin':
		'./includes/hooks/experiments/javascript/assets/admin',
	'javascript-experiment-public':
		'./includes/hooks/experiments/javascript/assets/public',
	'menu-experiment-management': './includes/hooks/experiments/menu/assets',
	'post-experiment-management': './includes/hooks/experiments/post/assets',
	'product-experiment-management':
		'./includes/hooks/woocommerce/experiments/product/editor/assets',
	public: './assets/src/public',
	'quick-actions': './assets/src/admin/scripts/quick-actions',
	settings: './includes/lib/settings/assets/js/src/settings.ts',
	'widget-experiment-management':
		'./includes/hooks/experiments/widget/assets',
};

module.exports = {
	...config,
	entry: {
		...nabPackages.reduce(
			( r, p ) => ( {
				...r,
				[ p ]: `./packages/${ p }/export.ts`,
			} ),
			{}
		),
		...pages,
		...scripts,
	},
	output: {
		path: path.resolve( __dirname, './assets/dist/' ),
		filename: 'js/[name].js',
		library: {
			name: 'nab',
			type: 'assign-properties',
		},
	},
};
