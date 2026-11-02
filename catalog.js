(() => {
	"use strict";

	const kits = [
		{ id: "press-launch", title: "Product Launch Press Kit", category: "Press", formats: ["Docs", "Canva"], languages: ["English"], summary: "A press release, fact sheet and email pitch for announcing a new product.", includes: ["Press release template", "One-page fact sheet", "Three pitch emails", "Quote request checklist"], audience: "Small teams and founders introducing a new product, service or big idea.", updated: "2026-10-01", image: "photo-1455390582262-044cdead277a" },
		{ id: "social-calendar", title: "30-Day Social Calendar", category: "Social", formats: ["Canva"], languages: ["English", "Arabic"], summary: "A month of flexible prompts and post layouts to make a consistent social rhythm feel lighter.", includes: ["30 daily post prompts", "Editable calendar", "Story and feed layouts", "Caption planning sheet"], audience: "Solo creators and small teams who want a steady, sustainable social presence.", updated: "2026-09-18", image: "photo-1516321318423-f06f85e504b3" },
		{ id: "crisis-statement", title: "Crisis Statement Starter Pack", category: "Press", formats: ["Docs"], languages: ["English", "Arabic"], summary: "Clear, calm frameworks for preparing a first response when the words matter most.", includes: ["Holding statement template", "Internal update draft", "Spokesperson notes", "Response checklist"], audience: "Communications leads and small organizations preparing a responsible response plan.", updated: "2026-09-08", image: "photo-1456324504439-367cee3b3c32" },
		{ id: "event-announcement", title: "Event Announcement Bundle", category: "Events", formats: ["Canva"], languages: ["English"], summary: "A coordinated set of event announcements, from the first save-the-date to the final reminder.", includes: ["Save-the-date graphic", "Event announcement post", "Email invitation", "Last-call reminder"], audience: "Community organizers, independent venues and teams hosting a gathering.", updated: "2026-08-26", image: "photo-1505373877841-8d25f7d46678" },
		{ id: "brand-voice", title: "Brand Voice One-Pager", category: "Brand", formats: ["Docs"], languages: ["English", "Arabic"], summary: "A concise guide to help everyone write with the same recognizable point of view.", includes: ["Voice principles", "Tone spectrum", "Before-and-after examples", "Words to use and avoid"], audience: "Growing teams who want their website, emails and social posts to sound like one brand.", updated: "2026-08-11", image: "photo-1454165804606-c3d57bc86b40" },
		{ id: "newsletter-monthly", title: "Monthly Newsletter Template", category: "Email", formats: ["Canva"], languages: ["English"], summary: "A warm, adaptable newsletter layout for sharing updates people actually want to read.", includes: ["Email layout", "Subject line prompts", "Monthly round-up sections", "Plain-text companion"], audience: "Independent shops, community projects and small teams staying in touch with their people.", updated: "2026-07-30", image: "photo-1497215842964-222b430dc094" },
		{ id: "podcast-episode", title: "Podcast Episode Kit", category: "Audio", formats: ["Canva", "Docs"], languages: ["English"], summary: "A practical set of tools to take an episode from a rough idea to a polished release.", includes: ["Episode planning sheet", "Guest briefing email", "Show notes outline", "Promotion graphics"], audience: "Independent podcasters and small production teams building a thoughtful show.", updated: "2026-07-12", image: "photo-1478737270239-2f02b77fc618" },
		{ id: "annual-report", title: "Annual Report Slides", category: "Presentations", formats: ["Canva"], languages: ["English"], summary: "A considered slide deck for turning a year of work into a clear, human story.", includes: ["Cover and overview slides", "Impact metrics layouts", "Project highlights", "Next-year priorities"], audience: "Nonprofits, small organizations and teams sharing the impact of their year.", updated: "2026-06-24", image: "photo-1454165804606-c3d57bc86b40" }
	];

	const savedKey = "evergreen-catalog-saved";
	const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
	const loadSaved = () => {
		try {
			const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
			return Array.isArray(saved) ? saved : [];
		} catch {
			return [];
		}
	};
	let savedIds = loadSaved();

	const updateSavedCount = () => {
		const count = document.querySelector("#saved-count");
		if (count) count.textContent = String(savedIds.length);
	};

	const kitCard = (kit, index) => {
		const saved = savedIds.includes(kit.id);
		return `<article class="kit-card" style="--card-index:${index}">
			<a class="kit-card-link" href="kit.html?id=${encodeURIComponent(kit.id)}" aria-label="View ${kit.title}">
				<div class="kit-image-wrap"><img src="${imageUrl(kit.image)}" alt="Styled workspace preview for ${kit.title}" loading="lazy"><span class="image-label">${kit.category}</span><span class="image-arrow" aria-hidden="true">↗</span></div>
				<div class="kit-card-copy"><div class="card-kicker"><span>${kit.category}</span><span>${kit.formats.join(" · ")}</span></div><h3>${kit.title}</h3><p>${kit.summary}</p><div class="card-bottom"><span>${kit.languages.join(" · ")}</span><span class="card-open">Explore <span aria-hidden="true">→</span></span></div></div>
			</a>
			<button class="save-button${saved ? " is-saved" : ""}" type="button" data-save="${kit.id}" aria-label="${saved ? "Remove" : "Save"} ${kit.title}" aria-pressed="${saved}"><span aria-hidden="true">${saved ? "♥" : "♡"}</span></button>
		</article>`;
	};

	const selectedValues = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);

	const filterKits = (data, filters) => data.filter((kit) => {
		const query = filters.query.trim().toLowerCase();
		const searchable = [kit.title, kit.category, kit.summary, ...kit.formats, ...kit.languages].join(" ").toLowerCase();
		return (!query || searchable.includes(query))
			&& (!filters.category.length || filters.category.includes(kit.category))
			&& (!filters.format.length || filters.format.some((format) => kit.formats.includes(format)))
			&& (!filters.language.length || filters.language.some((language) => kit.languages.includes(language)))
			&& (!filters.savedOnly || savedIds.includes(kit.id));
	});

	const initCatalog = () => {
		const resultGrid = document.querySelector("#kit-results");
		if (!resultGrid) return;
		const search = document.querySelector("#kit-search");
		const sort = document.querySelector("#sort-kits");
		const resultCount = document.querySelector("#result-count");
		const emptyState = document.querySelector("#empty-state");
		const filterToggle = document.querySelector("#filter-toggle");
		const filterPanel = document.querySelector("#filter-panel");
		const favoritesToggle = document.querySelector("#favorites-toggle");
		let savedOnly = false;

		const render = () => {
			const filters = { query: search.value, category: selectedValues("category"), format: selectedValues("format"), language: selectedValues("language"), savedOnly };
			const filtered = filterKits(kits, filters);
			filtered.sort((a, b) => sort.value === "az" ? a.title.localeCompare(b.title) : b.updated.localeCompare(a.updated));
			resultGrid.innerHTML = filtered.map(kitCard).join("");
			resultGrid.hidden = filtered.length === 0;
			emptyState.hidden = filtered.length !== 0;
			resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "kit" : "kits"}${savedOnly ? " saved" : ""}`;
			const activeCount = filters.category.length + filters.format.length + filters.language.length;
			document.querySelector("#filter-count").textContent = String(activeCount);
			document.querySelector("#filter-count").hidden = activeCount === 0;
			favoritesToggle.setAttribute("aria-pressed", String(savedOnly));
			favoritesToggle.classList.toggle("is-active", savedOnly);
			updateSavedCount();
		};

		document.querySelectorAll(".filter-group input").forEach((input) => input.addEventListener("change", render));
		search.addEventListener("input", render);
		sort.addEventListener("change", render);
		document.querySelector("#clear-filters").addEventListener("click", () => {
			document.querySelectorAll(".filter-group input").forEach((input) => { input.checked = false; });
			search.value = "";
			savedOnly = false;
			render();
		});
		document.querySelector("#empty-clear").addEventListener("click", () => document.querySelector("#clear-filters").click());
		favoritesToggle.addEventListener("click", () => { savedOnly = !savedOnly; render(); });
		filterToggle.addEventListener("click", () => {
			const expanded = filterToggle.getAttribute("aria-expanded") === "true";
			filterToggle.setAttribute("aria-expanded", String(!expanded));
			filterPanel.classList.toggle("is-open", !expanded);
		});
		document.addEventListener("click", (event) => {
			const button = event.target.closest("[data-save]");
			if (!button) return;
			const id = button.dataset.save;
			savedIds = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
			try { localStorage.setItem(savedKey, JSON.stringify(savedIds)); } catch { /* Storage may be unavailable in private browsing. */ }
			render();
		});
		document.addEventListener("keydown", (event) => {
			if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
				event.preventDefault();
				search.focus();
			}
			if (event.key === "Escape" && filterPanel.classList.contains("is-open")) {
				filterPanel.classList.remove("is-open");
				filterToggle.setAttribute("aria-expanded", "false");
				filterToggle.focus();
			}
		});
		render();
	};

	const initKitPage = () => {
		const root = document.querySelector("#kit-detail");
		if (!root) return;
		const kit = kits.find((item) => item.id === new URLSearchParams(window.location.search).get("id"));
		if (!kit) {
			root.innerHTML = `<section class="not-found"><p class="eyebrow">Nothing growing here</p><h1>We couldn't find that kit.</h1><p>It may have moved, or the link might be incomplete.</p><a class="button button-dark" href="catalog.html">Browse all kits <span aria-hidden="true">→</span></a></section>`;
			return;
		}

		const related = kits.filter((item) => item.id !== kit.id).sort((a, b) => Number(b.category === kit.category) - Number(a.category === kit.category)).slice(0, 3);
		const saved = savedIds.includes(kit.id);
		const galleryImages = [kit.image, "photo-1455390582262-044cdead277a", "photo-1454165804606-c3d57bc86b40"]
			.filter((image, index, images) => images.indexOf(image) === index);
		while (galleryImages.length < 3) galleryImages.push("photo-1497215842964-222b430dc094");
		root.innerHTML = `
			<section class="detail-hero">
				<div class="breadcrumb"><a href="catalog.html">All kits</a><span aria-hidden="true">/</span><span>${kit.category}</span></div>
				<div class="detail-heading"><p class="eyebrow"><span class="eyebrow-line"></span>${kit.category} kit</p><h1>${kit.title}</h1><p>${kit.summary}</p></div>
			</section>
			<div class="detail-gallery" aria-label="${kit.title} preview gallery">
				${galleryImages.map((image, index) => `<img src="${imageUrl(image, 1200)}" alt="${kit.title} preview ${index + 1}" ${index ? "loading=\"lazy\"" : ""}>`).join("")}
			</div>
			<section class="detail-content">
				<div><h2>What's inside</h2><ul class="includes-list">${kit.includes.map((item) => `<li>${item}</li>`).join("")}</ul></div>
				<aside class="detail-sidebar"><h2>Made for</h2><p class="audience-copy">${kit.audience}</p>
					<dl class="kit-meta"><div><dt>Formats</dt><dd>${kit.formats.join(" · ")}</dd></div><div><dt>Languages</dt><dd>${kit.languages.join(" · ")}</dd></div><div><dt>Updated</dt><dd>${new Date(`${kit.updated}T00:00:00`).toLocaleDateString("en", { year: "numeric", month: "long" })}</dd></div></dl>
					<button class="button button-dark get-kit" id="get-kit" type="button">Get this kit <span aria-hidden="true">→</span></button>
					<button class="detail-save save-button${saved ? " is-saved" : ""}" id="detail-save" type="button" aria-label="${saved ? "Remove" : "Save"} ${kit.title}" aria-pressed="${saved}"><span aria-hidden="true">${saved ? "♥" : "♡"}</span> ${saved ? "Saved" : "Save this kit"}</button>
				</aside>
			</section>
			<section class="detail-related" aria-labelledby="related-title"><div class="detail-related-heading"><h2 id="related-title">You might also like</h2><a href="catalog.html">View all kits <span aria-hidden="true">→</span></a></div><div class="kit-grid">${related.map(kitCard).join("")}</div></section>`;

		const dialog = document.querySelector("#sample-dialog");
		document.querySelector("#get-kit").addEventListener("click", () => dialog.showModal());
		document.querySelectorAll(".dialog-close, .dialog-done").forEach((button) => button.addEventListener("click", () => dialog.close()));
		dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
		document.querySelector("#detail-save").addEventListener("click", (event) => {
			const button = event.currentTarget;
			savedIds = savedIds.includes(kit.id) ? savedIds.filter((id) => id !== kit.id) : [...savedIds, kit.id];
			try { localStorage.setItem(savedKey, JSON.stringify(savedIds)); } catch { /* Storage may be unavailable in private browsing. */ }
			const nowSaved = savedIds.includes(kit.id);
			button.classList.toggle("is-saved", nowSaved);
			button.setAttribute("aria-pressed", String(nowSaved));
			button.setAttribute("aria-label", `${nowSaved ? "Remove" : "Save"} ${kit.title}`);
			button.innerHTML = `<span aria-hidden="true">${nowSaved ? "♥" : "♡"}</span> ${nowSaved ? "Saved" : "Save this kit"}`;
		});
		root.addEventListener("click", (event) => {
			const button = event.target.closest("[data-save]");
			if (!button) return;
			const id = button.dataset.save;
			savedIds = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
			try { localStorage.setItem(savedKey, JSON.stringify(savedIds)); } catch { /* Storage may be unavailable in private browsing. */ }
			const nowSaved = savedIds.includes(id);
			button.classList.toggle("is-saved", nowSaved);
			button.setAttribute("aria-pressed", String(nowSaved));
			button.setAttribute("aria-label", `${nowSaved ? "Remove" : "Save"} ${kits.find((item) => item.id === id).title}`);
			button.innerHTML = `<span aria-hidden="true">${nowSaved ? "♥" : "♡"}</span>`;
		});
	};

	window.EvergreenCatalog = { kits, imageUrl, savedIds: () => [...savedIds] };
	updateSavedCount();
	initCatalog();
	initKitPage();
})();
