# TEKTALKKREYÒL ACADEMY — DOSYE MÈT POU CODEX

> Dokiman espesifikasyon pou devlope yon platfòm aprantisaj konplè. Tout tèks itilizatè yo, kou yo, kestyon yo, erè yo ak mesaj yo dwe ekri an kreyòl ayisyen natirèl. Non API, mo kòd ak mak pwodwi yo rete jan yo ye.

## ENSTRIKSYON POU CODEX — LI SA AN PREMYE

Ou se achitèk lojisyèl, enjenyè full-stack, ekspè sekirite aplikasyon, konseptè UX/UI ak konseptè kou. Devlope TEKTALKKREYÒL ACADEMY kòm yon aplikasyon reyèl, pa kòm mockup. Pa sote etap, pa mete bouton ki pa fonksyone, pa envante lyen afilyasyon ni idantifyan videyo. Kreye yon plan, fè etap yo youn apre lòt, kouri tès, korije erè epi dokimante tout bagay. Si yon sèvis ekstèn mande kle oswa kont, sèvi ak varyab anviwònman ak egzanp; pa janm envante sekrè.

**IMPORTANT: Plan sa a bay plan pedagojik detaye ak egzijans pou chak leson. Codex dwe ekri tout tèks teyori konplè, demonstrasyon, kesyon ak repons pou chak leson, olye li kite rezime sa yo kòm kou final.** Chak leson dwe gen omwen 800–1200 mo itil nan kreyòl, eksepte kote demonstrasyon kòd ranplase yon pati; revize tèks la anvan piblikasyon. Yon revizyon pa yon moun ki metrize kreyòl ayisyen nesesè; okenn sistèm pa ka garanti zewo erè otomatikman.

## OBJEKTIF
- Platfòm: TEKTALKKREYÒL ACADEMY.
- Premye kou: «Google Workspace, entèlijans atifisyèl ak automatisation pou biznis».
- 10 modil, 4 leson pa modil, 40 leson; elèv ka enskri gratis.
- Chak leson: objektif, prereki, teyori konplè, egzanp, demonstrasyon, kesyon ak eksplikasyon repons, videyo YouTube entegre (sèlman URL verifye), devwa, zouti ak bouton afilyasyon transparan.
- Egzamen modil ak pwojè final; pwogrè sove; sètifika ki ka verifye.
- Admin ka modifye kou, videyo, lyen, kestyon, devwa, pri ak tèks san deplwaye kòd.

## STACK AK DEPLOIEMENT
- Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Zod, React Hook Form.
- Supabase Auth + PostgreSQL + Row Level Security; SQL migrations vèsyone.
- MDX pou kò leson yo, ak metadata nan PostgreSQL. Sanitize kontni; admin-only publish.
- YouTube iframe API ak privacy-enhanced domain youtube-nocookie.com lè sa aplikab; montre bouton «Gade sou YouTube» si embedding bloke. Pa sèvi ak videyo san verifye dwa ak embedding.
- Vitest + Testing Library + Playwright + axe accessibility; ESLint + Prettier + TypeScript check.
- GitHub Actions pou lint, tests, build, migration checks.
- Pou prototip: free tier Supabase ak hosting gratis ki otorize itilizasyon ki prevwa a. Vercel Hobby ka gen restriksyon komèsyal; pa itilize li pou biznis san verifye kondisyon aktyèl yo. Prepare Dockerfile ak deplwaman altènatif.
- Pa pwomèt ke sèvis, hosting, domèn oswa plan Google Workspace gratis.

## WÒL AK FONKSYON
- Vizitè: paj dakèy, katalòg, preview, rechèch, FAQ, deklarasyon afilyasyon.
- Elèv: enskripsyon, login, rekiperasyon modpas, dashboard, leson, bookmarks, nòt pèsonèl, egzamen, devwa, sètifika.
- Editè: prepare ak modifye leson, kesyon, videyo, zouti; pa jere itilizatè.
- Administratè: pibliye kou, moderasyon, wòl, dashboard, jesyon afilyasyon, analitik, export.
- Itilize server-side authorization sou CHAK operasyon, pa sèlman kache bouton sou frontend.

## ESTRIKTI PAJ
/, /kou, /kou/[slug], /enskri, /konekte, /bliye-modpas, /tablo-bod, /aprann/[course]/[lesson], /evalyasyon/[id], /devwa/[id], /setifika/[id], /verifye/[code], /zouti, /sou-nou, /kontak, /konfidansyalite, /kondisyon, /afilyasyon, /admin, /admin/kou, /admin/leson, /admin/videyo, /admin/zouti, /admin/kesyon, /admin/rapo.

## BAZDONE — TABLO
profiles(id UUID FK auth.users, display_name, role, created_at); courses(id, slug, title, summary, status, cover_url, language, published_at); modules(id, course_id, position, title, summary); lessons(id, module_id, slug, position, title, objectives JSONB, prerequisites JSONB, mdx_content, status, duration_minutes, video_id nullable, tool_id nullable); video_resources(id, youtube_video_id, title, source_url, embed_allowed_verified_at, language, checked_at); tools(id, name, official_url, affiliate_url nullable, disclosure, status, last_verified_at); enrollments(id, user_id, course_id, created_at); lesson_progress(id, user_id, lesson_id, status, completed_at); quizzes(id, lesson_id nullable, module_id nullable, passing_score, attempts_limit); questions(id, quiz_id, type, prompt, options JSONB, correct_answer JSONB, explanation, position); quiz_attempts(id, quiz_id, user_id, score, submitted_at); assignments(id, lesson_id, instructions, rubric JSONB); submissions(id, assignment_id, user_id, content, file_path nullable, status, grade, feedback); certificates(id, user_id, course_id, verification_code unique, issued_at); affiliate_events(id, tool_id, lesson_id nullable, visitor_session_id, event_type, created_at, consent_status); audit_logs(id, actor_id, action, entity_type, entity_id, created_at); consent_records(id, user_id nullable, purpose, granted, recorded_at).

- PK/FK/UNIQUE/CHECK/indexes; constraints sou pozisyon modil ak leson; migration rollback plan.
- RLS: elèv wè sèlman pwòp done prive yo; kontni published vizib pou moun ki gen dwa; editè/admin verifye sou sèvè; answer keys pa janm voye nan payload kestyon anvan soumèt.
- Pa konte clic kòm vant. Evènman afilyasyon yo se mezi entèn, pa konfimasyon komisyon.
- Pou afilyasyon, admin dwe antre URL egzak ki soti nan kont afilyasyon li; whitelist HTTPS, validate hostname ak redirect, rel="sponsored noopener noreferrer", target="_blank", disclosure klè.

## KONPÒTMAN EGZAMEN
- Chak leson: 5 kestyon (2 chwa miltip, 1 vre/fo, 1 kesyon aplikasyon, 1 ka pratik), ak repons + eksplikasyon sere sou sèvè.
- Chak modil: egzamen 10 kestyon ki pran nan bank kestyon; objektif 80% pou pase, 3 tantativ ak revizyon ant tantativ yo.
- Chak devwa: objektif, etap, livrezon, barèm 100 pwen, kritè sekirite; elèv ka sove bouyon.
- Sètifika: tout 40 leson konplete, 10 egzamen modil pase, pwojè final valide; paj verifikasyon piblik pa montre enfòmasyon sansib.

## VIDEO YOUTUBE
- Chak leson dwe gen video_resource oubyen etikèt «Videyo ap vini». Pa envante ID videyo. Admin antre URL reyèl epi verifye embedding ak lisans.
- Priorite: videyo an kreyòl; si pa genyen, yon videyo ofisyèl nan lòt lang ak yon rezime egzak an kreyòl; pa pretann videyo a an kreyòl.
- Lazy-load iframe sèlman apre entèraksyon pou amelyore pèfòmans ak vi prive; bay tit aksesib ak transkripsyon/lien kote sa disponib.

## SEKIRITE AK KONFIDANSYALITE
- MFA admin; password reset; Supabase Auth; rate limiting; CSRF protection apwopriye; validasyon Zod server-side; CSP; secure headers; pa ekspoze service_role key.
- SQL RLS ak tès pou atak aksè kwa-itilizatè; uploads ak signed URLs, limit kalite ak gwosè; pa ekzekite kòd elèv sou sèvè a.
- Consent separe pou email maketing, cookies/analytics; unsubscribe; minimizasyon done; règleman efasman; backup ak restore teste.
- Pa voye done kliyan reyèl nan zouti IA san otorizasyon; itilize done fiktif nan kou.

## KONDISYON KOMÈSYAL
- Montre diferans ant plan Workspace yo ak pri ajou ki soti nan sous ofisyèl, san hardcode reklam ki pa verifye.
- Montre deklarasyon afilyasyon sou paj zouti ak bò bouton an. Yon elèv pa oblije klike afilyasyon pou pase kou.
- Google Workspace, Gemini, Apps Script, n8n, AppSheet, Antigravity ka gen kondisyon, lisans ak limit diferan. Verifye fonksyon yo avan pibliye.

## CRITÈRES D'ACCEPTATION
- Pa gen placeholder fo bouton, fo sètifika, fo videyo, fo lyen afilyasyon.
- Kreyòl natirèl, san mo envante, aksan ak òtograf verifye, tès proofreading manyèl.
- Lighthouse mobile >=90 kòm objektif sou paj kle yo; WCAG 2.2 AA kòm objektif; responsive 320px rive desktop.
- 100% paj kritik teste; pa gen sekrè nan repo; tout API protected; tès RLS pase.
- Dokimantasyon README, .env.example, seed, migrations, admin guide, user guide, deployment guide, threat model.

## PLAN EKZEKISYON POU CODEX
1. Ekri architecture.md, backlog.md, security.md, content-style-guide.md; mete plan ak risk.
2. Scaffold Next.js, UI kit, routes, responsive layouts, lint, CI.
3. Supabase migrations, RLS, auth, roles, integration tests.
4. CMS admin ak editè MDX, preview, workflow draft/review/published.
5. Lesson viewer, YouTube embeds, tool cards, affiliate redirects.
6. Quiz engine server-side, progress, assignments, certificates.
7. Kreye seed kou a, 10 modil ak 40 leson; ekri teyori reyèl yo pa gwoup 4 leson, valide kreyòl avan kontinye.
8. Admin analytics, search, accessibility, privacy, performance.
9. E2E tests, security review, backup/restore, deployment.
10. Bay lis kont/kle reyèl itilizatè a dwe konfigire; pa fè tankou sèvis yo deja konekte.

## MODÈL OBLIGATWA POU CHAK LESON
- Tit, dire 30–60 min, nivo, objektif 3–5, prereki.
- «Sa ou pral aprann»; «Poukisa sa enpòtan»; teyori an 5–8 seksyon ak definisyon klè.
- Demonstrasyon etap pa etap ak rezilta atandi; si kòd, kòd fonksyonèl, varyab byen nonmen, validation, error handling, comments.
- «Erè moun konn fè» (3 erè) ak koreksyon.
- «Videyo pou ede w konprann»: video_id reyèl verifye oswa «Videyo ap vini».
- «Teste konesans ou»: 5 kestyon, 4 opsyon lè aplikab, repons ak rezon.
- «Devwa pou pratike»: etap, sa pou remèt, barèm ak solisyon modèl.
- «Zouti pou pratike»: non, URL ofisyèl, URL afilyasyon si admin mete l, disclosure.
- «Rezime» ak «Pwochen etap».

## BANK MODIL AK PLAN LESON YO

### MODIL 1: Fondasyon Google Workspace
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 1.1 — Kisa Google Workspace ye?
**Teyori pou devlope:** Diferans ant yon kont Gmail pèsonèl ak yon sèvis pou biznis; done, kontwòl, depans.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Fè yon tablo konparezon Gmail ak Workspace.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 1.2 — Konprann plan yo
**Teyori pou devlope:** Starter, Standard, Plus ak Enterprise; pri pou chak itilizatè; limit ak kondisyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Chwazi yon plan pou twa kalite biznis epi esplike rezon ou.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 1.3 — Domèn ak imèl pwofesyonèl
**Teyori pou devlope:** DNS, MX, SPF, DKIM, DMARC; diferans ant achte domèn ak abònman Workspace.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Prepare yon lis etap pou konfigire yon domèn tès.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 1.4 — Sekirite ak kont itilizatè
**Teyori pou devlope:** Wòl administratè, modpas solid, MFA, itilizatè ak gwoup.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Fè yon plan dwa aksè pou yon ekip senk moun.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 2: Gmail, Drive ak kolaborasyon
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 2.1 — Òganize Gmail
**Teyori pou devlope:** Etikèt, filtè, rechèch, siyati, mesaj otomatik.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye twa règ pou klase mesaj kliyan.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 2.2 — Google Drive pou ekip
**Teyori pou devlope:** Dosye, pataj, pèmisyon, espas depo ak kontwòl vèsyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Desine estrikti dosye yon ti antrepriz.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 2.3 — Docs ak Meet
**Teyori pou devlope:** Dokiman pataje, kòmantè, reyinyon ak bon pratik.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Prepare yon modèl pwopozisyon sèvis.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 2.4 — Calendar ak rezèvasyon
**Teyori pou devlope:** Kalandriye pataje, envitasyon, randevou, zòn lè.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Planifye yon semèn randevou pou yon sèvis.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 3: Google Sheets pou jesyon biznis
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 3.1 — Baz Sheets
**Teyori pou devlope:** Selil, ranje, kolòn, kalite done ak fòma.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye yon tablo 20 lavant.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 3.2 — Fòmil esansyèl
**Teyori pou devlope:** SUM, IF, COUNTIF, FILTER ak validasyon done.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kalkile revni ak kantite kòmann yo.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 3.3 — CRM senp
**Teyori pou devlope:** Kontak, etap lavant, dat swivi, estati kliyan.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Konstwi yon CRM ak dis kliyan fiktif.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 3.4 — Rapò ak tablodbò
**Teyori pou devlope:** Grafik, tablo rezime, KPI, pwoteksyon done.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye yon rapò lavant chak semèn.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 4: Gemini ak IA nan travay
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 4.1 — Kisa IA ka fè?
**Teyori pou devlope:** Limit modèl lang, verifikasyon, vi prive, done sansib.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Konpare twa repons IA ak sous serye.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 4.2 — Ekri bon enstriksyon
**Teyori pou devlope:** Objektif, kontèks, fòma, egzanp ak restriksyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri senk enstriksyon pou sèvis kliyan.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 4.3 — Gemini ak dokiman
**Teyori pou devlope:** Rezime, plan, koreksyon, disponiblite fonksyon selon plan.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Prepare yon rezime yon dokiman tès.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 4.4 — Evalye rezilta IA
**Teyori pou devlope:** Erè, prejije, done pèsonèl ak apwobasyon moun.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye yon lis kontwòl kalite pou IA.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 5: Google Forms ak Apps Script
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 5.1 — Fòm pou ranmase done
**Teyori pou devlope:** Kesyon, validasyon, konsantman ak koneksyon ak Sheets.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye yon fòm kòmann demonstrasyon.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 5.2 — Premye kòd Apps Script
**Teyori pou devlope:** Varyab, fonksyon, kondisyon, bouk, Logger.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri yon fonksyon ki kalkile total kòmann.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 5.3 — Otomatize Sheets ak Gmail
**Teyori pou devlope:** SpreadsheetApp, MailApp, quotas, pèmisyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Voye yon mesaj tès sèlman bay pwòp kont ou.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 5.4 — Deklanche ak jere erè
**Teyori pou devlope:** Triggers, retry, idempotans, logs, limit ekzekisyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri yon pwosedi pou evite mesaj doub.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 6: n8n ak workflows
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 6.1 — Konprann workflows
**Teyori pou devlope:** Nœuds, triggers, aksyon, API ak webhook.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Desine yon workflow pou nouvo kliyan.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 6.2 — Konekte Google ak OAuth
**Teyori pou devlope:** OAuth, scopes minimòm, sekrè ak kont tès.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Dokimante etap otorizasyon yo.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 6.3 — Otomatizasyon kòmann
**Teyori pou devlope:** Forms/Sheets → validasyon → notifikasyon → swivi.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Konstwi yon workflow ak done fiktif.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 6.4 — Tès ak siveyans
**Teyori pou devlope:** Logs, erè, retry, limit ak alèt.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Teste senk ka erè epi dokimante yo.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 7: Antigravity ak devlopman asisté
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 7.1 — Konprann Antigravity
**Teyori pou devlope:** Anviwònman devlopman, ajan, zouti ak limit.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri espesifikasyon yon ti aplikasyon.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 7.2 — Enstriksyon pou ajan kòd
**Teyori pou devlope:** Plan, fichye, kritè akseptasyon, revizyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Prepare yon prompt pou yon CRM senp.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 7.3 — Kreye yon aplikasyon web
**Teyori pou devlope:** Frontend, backend, bazdone, API, otantifikasyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Konstwi yon prototip san done reyèl.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 7.4 — Tès ak deplwaman
**Teyori pou devlope:** Git, revizyon kòd, tès, sekrè, anviwònman.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Revize yon pull request epi korije twa erè.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 8: AppSheet ak aplikasyon san anpil kòd
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 8.1 — Kisa AppSheet ye?
**Teyori pou devlope:** Aplikasyon ki baze sou done, lisans ak limit.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Chwazi yon ka itilizasyon reyalis.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 8.2 — Modèl done
**Teyori pou devlope:** Tablo, kle, relasyon ak validasyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Desine bazdone yon envantè.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 8.3 — Ekran ak aksyon
**Teyori pou devlope:** Fòm, lis, rechèch ak wòl.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye ekran pou ajoute yon pwodwi.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 8.4 — Sekirite ak piblikasyon
**Teyori pou devlope:** Kontwòl aksè, done sansib, pri, tès.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Teste aplikasyon an ak de wòl.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 9: Pwojè AutoBiz Workspace
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 9.1 — Analiz bezwen biznis
**Teyori pou devlope:** Aktè, pwosesis, kondisyon fonksyonèl ak done.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri dokiman bezwen pou yon magazen.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 9.2 — Konstwi bazdone ak fòm
**Teyori pou devlope:** Kliyan, pwodwi, kòmann, validasyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kreye done fiktif pou 30 kòmann.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 9.3 — Otomatize sik lavant
**Teyori pou devlope:** Notifikasyon, rapèl, kalandriye, apwobasyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Teste sik yon kòmann depi kòmansman rive nan fen.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 9.4 — Tablodbò ak demonstrasyon
**Teyori pou devlope:** KPI, rapò, tès itilizatè, videyo demonstrasyon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Prezante yon demonstrasyon senk minit.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

### MODIL 10: Sekirite, lansman ak biznis
**Objektif modil:** Elèv la kapab aplike kat konpetans yo nan yon ti biznis avèk done demonstrasyon. **Egzamen final modil:** 10 kestyon, nòt minimòm 80%.

#### 10.1 — Sekirite ak konfidansyalite
**Teyori pou devlope:** MFA, RLS, backup, done pèsonèl, dwa aksè.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Fè yon odit sekirite sou pwojè a.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 10.2 — Pri ak chwa plan
**Teyori pou devlope:** Bidjè, pri pa itilizatè, depans kache, konparezon.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Kalkile pri pou ekip 3, 10, 25 moun.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 10.3 — Afilyasyon ki transparan
**Teyori pou devlope:** Deklarasyon komisyon, règ pwogram, atribisyon, san pwomès.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Ekri yon paj transparans afilyasyon.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

#### 10.4 — Pwojè final ak sètifika
**Teyori pou devlope:** Tès final, rapò, demonstrasyon, nòt ak kritè.
**Demonstrasyon:** Montre etap yo sou yon ka biznis fiktif; eksplike chak desizyon, kondisyon, limit ak rezilta.
**Kestion 1:** Ki pwoblèm leson sa a rezoud? **Repons modèl:** Li rezoud pwoblèm ki dekri nan objektif leson an; egzije yon egzanp espesifik.
**Kestion 2:** Ki risk oswa limit ki pi enpòtan? **Repons modèl:** Site limit sekirite, pri oswa dwa aksè ki konsène leson an.
**Kestion 3:** Ki etap pou verifye yon rezilta? **Repons modèl:** Fè tès ak done fiktif, konpare rezilta ak sa nou te espere.
**Kestion 4:** Vre oswa fo: Tout fonksyon yo gratis pou tout moun. **Repons:** Fo; disponiblite depann de plan ak kondisyon.
**Kestion 5:** Bay yon ka kote ou pa ta dwe otomatize san apwobasyon moun. **Repons modèl:** Lè aksyon an ka voye done prive, chaje lajan oswa chanje done enpòtan.
**Devwa:** Soumèt pwojè final ak dokimantasyon.
**Barèm:** Presizyon 40, aplikasyon 30, sekirite 20, prezantasyon 10. **Solisyon modèl:** Bay yon egzanp konplè nan kontni leson final la, pa sèlman konsèy jeneral.
**Videyo:** Mete yon videyo YouTube verifye sou sijè sa a; si pa disponib, `video_id=null` ak etikèt «Videyo ap vini».
**Zouti:** Mete bouton URL ofisyèl zouti ki konsène sijè a; si gen URL afilyasyon valide, sèvi avè l ak deklarasyon komèsyal.

## PROJÈ FINAL AK BARÈM
«AutoBiz Workspace»: yon biznis fiktif resevwa kòmann atravè yon fòm, sove yo nan Sheets, verifye done, notifye yon moun responsab, epi montre rezilta yo nan yon tablodbò. Kritè: achitekti 20, fonksyonalite 30, tès 20, sekirite 20, dokimantasyon 10. Pa egzije abònman peye pou elèv ka fini: ofri yon vèsyon demonstrasyon gratis kote posib.

## KONTNI DEMO KREYÒL POU HOME
H1: «Aprann teknoloji pou devlope biznis ou»
Sous-tit: «Kou pratik an kreyòl ayisyen sou Google Workspace, entèlijans atifisyèl, pwogramasyon ak automatisation.»
CTA: «Kòmanse aprann gratis»; «Gade kou yo»; «Kontinye aprann»; «Teste konesans ou»; «Remèt devwa mwen»; «Ale sou sit zouti a»; «Lyen patenarya»; «Videyo ap vini»; «Ou pase egzamen an»; «Eseye ankò».

## KÒMANSMAN POU CODEX
Premye repons ou: enspekte repo a; prezante achitekti ak plan etap pa etap, fichye ou pral kreye, depandans, risk, ak kesyon bloke sèlman. Apre sa, aplike faz 1–3 ak tès yo. Pa prezante yon sit makèt kòm pwodwi fini. Kontinye ak faz ki rete yo, modil pa modil, avèk tès ak revizyon kreyòl.
