import { buildOneFormFromRegex } from "../morphoHelpers/buildFormRule";
import createRulesFromMorphologyData from "../morphoHelpers/createRulesFromMorphologyData";
import { searchAndReplaceWithOneRegex } from "../morphoHelpers/regexHelpers";

/**
 * Checks whether a given word is a verb to which certain stem modifications need to be applied.
 *
 * @param {string}  word                The word to check.
 * @param {Object}  morphologyDataES    The Spanish morphology data.
 *
 * @returns {string|null} The modified stem if any modifications apply or null.
 */
export function checkVerbStemModifications( word, morphologyDataES ) {
	const verbStemModifications = morphologyDataES.verbStemModifications;

	const quToCReplacement = searchAndReplaceWithOneRegex( word, verbStemModifications.quToC );

	// This modification is checked separately because it's sometimes combined wit the dipththong modification.
	if ( quToCReplacement ) {
		// Check diphthong replacement.
		const ueToOReplacement = searchAndReplaceWithOneRegex( quToCReplacement, verbStemModifications.ueToOSimple );

		if ( ueToOReplacement ) {
			return ueToOReplacement;
		}

		return quToCReplacement;
	}

	// All of the modifications checked in this step are mutually exclusive.
	const verbWithStemReplacement = buildOneFormFromRegex(
		word,
		createRulesFromMorphologyData( [ ...verbStemModifications.stemModifications, verbStemModifications.ueToO ] )
	);

	if ( verbWithStemReplacement ) {
		return verbWithStemReplacement;
	}

	return null;
}
