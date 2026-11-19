// Synthetic keyed-text and string-identity sources for the localization / identity readers.
// Shapes follow VexLife-Prod at a587771: catalog JSON per scope, dataKey anchors in main and test
// source, the reply-language bridge, the strings service, generated markup and runtime.

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const WORKSPACE_CATALOG = json({
  _meta: { scope: 'workspace', dataKeyOwners: { dictation: 'VexLifeDictationFamily (state, control refs)' } },
  'workspace.button.dictation-start': { strings: { en: { text: 'Start dictation' }, ja: { text: '音声入力を開始' } }, surfaces: ['workspace.conversation'], dataKey: 'dictation:control:START' },
  'workspace.button.dictation-stop': { strings: { en: { text: 'Stop dictation' }, ja: { text: '停止', _stale: true } }, surfaces: ['workspace.conversation'], dataKey: 'dictation:control:STOP', lens: 'element.workspace.dictation' },
  'workspace.status.dictation-listening': { strings: { en: { text: 'Listening' } }, surfaces: ['workspace.conversation'], dataKey: 'dictation:state:LISTENING' },
  'workspace.button.ghost': { strings: { en: { text: 'Ghost' }, ja: { text: 'ゴースト' } }, surfaces: ['workspace.conversation'], dataKey: 'dictation:control:GHOST' },
  'workspace.label.reason': { strings: { en: { text: 'Permission' }, ja: { text: '許可' } }, surfaces: ['workspace.conversation'], dataKey: 'dictation:reason:PERMISSION' },
  'workspace.label.orphan': { strings: { en: { text: 'Orphan' }, ja: { text: '孤児' } }, surfaces: ['workspace.settings'], dataKey: 'nobody:state:X' },
  'workspace.heading.plain': { strings: { en: { text: 'Plain' }, ja: { text: '無地' } }, surfaces: ['workspace.settings'] },
});

export const SETUP_CATALOG = json({
  _meta: { scope: 'setup' },
  'setup.heading.current': { strings: { en: { text: 'VexLife is running.' }, ja: { text: 'VexLife は実行中です。' }, zh: { text: 'VexLife 正在运行。这是设置。' } }, surfaces: ['setup.window'] },
  'setup.button.start': { strings: { en: { text: 'Start' }, ja: { text: '開始' }, zh: { text: '启动' } }, surfaces: ['setup.window'] },
});

export const CATALOG_FILES = Object.freeze([
  { scope: 'setup', path: 'localization/strings/source/setup.json', text: SETUP_CATALOG },
  { scope: 'workspace', path: 'localization/strings/source/workspace.json', text: WORKSPACE_CATALOG },
]);

export const MAIN_ANCHOR = { path: 'src/jvmMain/kotlin/vexlife/web/VexLifeWorkspaceElements.kt', text: `package vexlife.web

object VexLifeWorkspaceElements {
    private val DictationControls =
        listOf(
                VexLifeDictationFamily.ControlStart,
                VexLifeDictationFamily.ControlStop,
            )

    val DataKeys: Set<String> = buildSet {
        VexLifeNoteFamily.StateRefs.forEach { add("note:state:$it") }
        DictationControls.forEach { add("dictation:control:$it") }
        vexlife.dictation.VexLifeDictationFamily.HoldRefs.map { "dictation:hold:$it" }
    }
}
` };

export const TEST_ANCHOR = { path: 'src/jvmTest/kotlin/vexlife/text/VexLifeStringsTest.kt', text: `package vexlife.text

class VexLifeStringsTest {
    fun workspaceDataKeys() {
        val refs =
            vexlife.dictation.VexLifeDictationFamily.StateRefs.map { "dictation:state:$it" } +
                vexlife.dictation.VexLifeDictationFamily.ReasonRefs.map {
                    "dictation:reason:$it"
                }
    }
}
` };

export const SETTINGS = { path: 'src/commonMain/kotlin/vexlife/person/VexLifePersonSettings.kt', text: `package vexlife.person

object VexLifePersonSettings {
    const val DefaultLanguage = "en"
    const val LegacyChinese = "zh"
    const val SimplifiedChinese = "zh-Hans"
    const val TraditionalChinese = "zh-Hant"

    fun canonicalReplyLanguage(code: String): String =
        if (code == LegacyChinese) TraditionalChinese else code

    /** Temporary bridge until application-localization gets its own setting/owner. */
    fun localizationLanguageForReply(code: String): String =
        when (canonicalReplyLanguage(code)) {
            SimplifiedChinese,
            TraditionalChinese,
            -> "zh"
            else -> code
        }
}
` };

export const STRINGS = { path: 'src/jvmMain/kotlin/vexlife/text/VexLifeStrings.kt', text: `package vexlife.text

object VexLifeStrings {
    fun selectLanguage(scope: String, vararg candidates: String?): String {
        val complete = catalog.completeLanguages(scope)
        return candidates.firstOrNull { it in complete } ?: "en"
    }

    fun normalizedLanguage(value: String): String = value.trim().lowercase().split('-', '_').first()
}
` };

export const SERVICE_STRINGS = { path: 'src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt', text: `package vexlife.service

class VexLifeProdLocalService {
    private fun handleStrings(exchange: HttpExchange, scope: String) {
        val language = VexLifePersonSettings.localizationLanguageForReply(personSettings.read().replyLanguage)
        val catalog = VexLifeStrings.catalog
        respond(catalog.keys.filter { it.startsWith("$scope.") }.associateWith { catalog.text(it, language) })
    }

    private fun handleSetupStrings(exchange: HttpExchange, scope: String) {
        val language = VexLifeStrings.selectLanguage(scope, VexLifePersonSettings.localizationLanguageForReply(personSettings.read().replyLanguage))
        respond(VexLifeStrings.catalog.keys.associateWith { VexLifeStrings.catalog.text(it, language) })
    }
}
` };

export const NOTE_FAMILY = { path: 'src/commonMain/kotlin/vexlife/note/VexLifeNoteFamily.kt', text: `package vexlife.note

object VexLifeNoteFamily {
    data class DisplayState(
        val label: String,
        val detail: String,
        val primaryControlRef: String?,
        val status: VexLifeText,
        val active: Boolean,
    ) : VexFamilyContract.DisplayState<VexLifeNoteFamily, State>

    fun observe(scopeState: String?): State =
        when {
            scopeState == "ENDED" -> Ready
            else -> Held
        }
}
` };

export const MARKUP = { path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebMarkup.kt', text: `package vexlife.web

internal object VexLifeWebMarkup {
    fun render(): String =
        """
        <button class="dictation" type="button" data-vex-ref="\${Blueprint.Dictation.identity.ref}" id="dictation" aria-label="workspace.button.dictation-start">
        <input id="note-field" type="text">
        <div id="status-slot"></div>
        """
}
` };

export const RUNTIME_SOURCE = { path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntime.kt', text: `package vexlife.web

internal object VexLifeWebRuntime {
    fun render(): String =
        """
        const byId = (id) => document.getElementById(id);
        byId('dictation').addEventListener('click', start);
        byId('note-field').value = '';
        byId('status-slot').textContent = '';
        if (dictation.state === 'LISTENING') stop();
        if (event.type === 'REASONING_DELTA') think();
        if (profile.mode === \${jsString(Modes.ExtendDefault)}) keep();
        if (profile.mode === 'EXTEND_DEFAULT') keep();
        """
}
` };

export const MODES = { path: 'src/commonMain/kotlin/vexlife/context/Modes.kt', text: `package vexlife.context

object Modes {
    const val ExtendDefault = "EXTEND_DEFAULT"
}
` };

export const MODES_CONSUMER = { path: 'src/jvmMain/kotlin/vexlife/context/ModeReader.kt', text: `package vexlife.context

class ModeReader {
    fun extends(mode: String): Boolean = Modes.values.isNotEmpty() && mode == "EXTEND_DEFAULT"

    fun fail(error: Throwable): String =
        error(
            "could not read mode: " +
                error::class.simpleName,
        )

    fun keyFor(value: Any): String = value::class.simpleName!!
}
` };

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][TEST-LOCALIZATION]
