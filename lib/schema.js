/*
 * lib/schema.js: JSON schemas for various Marlin records
 */

/*
 * Primitive schema components
 */

var sString = { 'type': 'string' };
var sObject = { 'type': 'object' };

var sStringRequired = {
	'type': 'string',
	'required': true
};

var sDateTime = {
	'type': 'string',
	'format': 'date-time'
};

var sDateTimeRequired = {
	'type': 'string',
	'format': 'date-time',
	'required': true
};

var sStringArray = {
	'type': 'array',
	'items': sString
};

var sStringArrayRequired = {
	'type': 'array',
	'required': true,
	'items': sString
};

var sNonNegativeIntegerRequired = {
	'type': 'integer',
	'required': true,
	'minimum': 0
};

/*
 * Marlin-specific reusable schema components
 */
var sJobPhase = {
	'type': 'object',
	'properties': {
		'type': {
			'type': 'string',
			'enum': [ 'generic', 'storage-map' ]
		},
		'assets': sStringArray,
		'exec': sStringRequired,
		'uarg': sObject
	}
};

var sJobPhases = {
	'type': 'array',
	'required': true,
	'minItems': 1,
	'items': sJobPhase
};

var sInputKeys = {
	'type': 'array',
	'required': true,
	'minItems': 1,
	'items': sString
};

var sOutputKeys = sStringArrayRequired;

var sError = {
	'type': 'object',
	'properties': {
		'code': sStringRequired,
		'message': sStringRequired
	}
};

/*
 * Job record in Moray
 */
var sMorayJob = {
	'type': 'object',
	'properties': {
		/* immutable job definition */
		'jobId': sStringRequired,
		'jobName': sStringRequired,
		'phases': sJobPhases,
		'inputKeys': sInputKeys,
		'createTime': sDateTimeRequired,

		/* public state (mediated by the web tier) */
		'state': {
			'type': 'string',
			'required': true,
			'enum': [ 'queued', 'running', 'done' ]
		},
		'doneKeys': sOutputKeys,
		'outputKeys': sOutputKeys,
		'discardedKeys': sOutputKeys,
		'finishTime': sDateTime,

		/* internal Marlin state */
		'worker': sString
	}
};

/*
 * Task group record in Moray
 */
var sMorayTaskGroup = {
	'type': 'object',
	'properties': {
		'jobId': sStringRequired,
		'taskGroupId': sStringRequired,
		'host': sStringRequired,
		'inputKeys': sInputKeys,
		'phase': sJobPhase,
		'phaseNum': sNonNegativeIntegerRequired,
		'state': {
			'type': 'string',
			'required': true,
			'enum': [ 'dispatched', 'running', 'done' ]
		},
 		'results': {
 			'type': 'array',
 			'required': true,
 			'items': {
 				'type': 'object',
 				'properties': {
 					'input': sStringRequired,
 					'machine': sString,
 					'outputs': sOutputKeys,
 					'result': {
 						'type': 'string',
 						'required': true,
 						'enum': [ 'ok', 'fail' ]
 					},
 					'partials': sStringArray,
 					'discarded': sStringArray,
 					'startTime': sDateTime,
 					'doneTime': sDateTime,
 					'error': sError
 				}
 			}
 		}
	}
};

/* Public interface */
exports.sMorayJob = sMorayJob;
exports.sMorayTaskGroup = sMorayTaskGroup;