const userID = "eeb6823c-b926-4ea2-866a-5542edd26e59", Password = "2a4ceb2b5436388dee0294561e82df28d93d43928d9c09baed260a22";
let 憠, 낞, 뎚 = "", 婌 = null, 噸 = 0, 뗠 = "", 慡 = {}, 맀 = 0, 뷚 = 1, 똳 = ["*tapecontent.net", "*cloudatacdn.com", "*loadshare.org", "*cdn-centaurus.com", "scholar.google.com"];
export default {
async fetch(ノ) {
	뎚 = ノ.cf.colo + ".\u0070\u0052O\u0058\u0079\u0049\u0050.cm\u006c\u0049\u0055\u0073\u0053\u0053s.N\u0045t";
	const 꼬 = (ノ.headers.get("Upgrade") || "").toLowerCase(), 돖 = (ノ.headers.get("content-type") || "").toLowerCase();
	if ("websocket" === 꼬) return await 嗠(ノ), await async function (궢, 봘) {
	const 뮞 = new WebSocketPair, [뒍, 궍] = Object.values(뮞);
	궍.accept(), 궍.binaryType = "arraybuffer";
		let 幎 = { 傆: null, 彭: null, 堵: null }, 儋 = 0;
	const 冉 = 궢.headers.get("sec-websocket-protocol") || "", 崅 = function (匣, 媅) {
			let 뇢 = 0;
		return new ReadableStream({
	start(꺿) {
			匣.addEventListener("message", 娔 => { 뇢 || 꺿.enqueue(娔.data) }), 匣.addEventListener("close", () => {
		뇢 || (孼(匣), 꺿.close());
					}), 匣.addEventListener("error", 妘 => 꺿.error(妘));
		const { earlyData: 밓, error: 嫼 } = function (뙋) {
						if (!뙋) return { error: null };
			try {
					const 땊 = atob(뙋.replace(/-/g, "+").replace(/_/g, "/")), 멗 = new Uint8Array(땊.length);
					for (let 彑 = 0; 彑 < 땊.length; 彑++) 멗[彑] = 땊.charCodeAt(彑);
						return { earlyData: 멗.buffer, error: null };
						} catch (론) {
					return { error: 론 };
		}
			}(媅);
						嫼 ? 꺿.error(嫼) : 밓 && 꺿.enqueue(밓);
	},
	cancel() { 뇢 = 1, 孼(匣) }
		});
		}(궍, 冉);
		let 弛 = null, 덐 = null, 悌 = null;
const 귵 = () => {
			if (悌) {
try { 悌.releaseLock() } catch (릉) { }
			悌 = null;
	}
		덐 = null;
	}, 儒 = async (벜, 뱣 = 1) => {
		const 꾶 = 幎.傆;
	if (!꾶) return 0;
		꾶 !== 덐 && (귵(), 덐 = 꾶, 悌 = 꾶.writable.getWriter());
			try { return await 悌.write(벜), 1 } catch (믌) {
	if (귵(), 뱣 && "function" == typeof 幎.堵) return await 幎.堵(), await 儒(벜, 0);
			throw 믌;
			}
		};
		return 崅.pipeTo(new WritableStream({
		async write(끄) {
			if (儋) return await 뚮(끄, 궍, null);
	if (!await 儒(끄)) {
			if (null === 弛) { const 복 = new Uint8Array(끄); 弛 = 복.byteLength >= 58 && 13 === 복[56] && 10 === 복[57] }
		if (!await 儒(끄)) if (弛) {
				const 낱 = 듊(끄);
				if (낱?.徬) throw Error();
			const { port: 날, hostname: 곯, 붐: 協 } = 낱;
				if (떏(곯)) throw Error();
		await 밖(곯, 날, 協, 궍, null, 幎, 봘);
				} else {
		const 득 = 垶(끄, 봘);
			if (득?.徬) throw Error();
		const { port: 맓, hostname: 몕, 뻳: 뉃, 戵: 껿, 똪: 徣 } = 득;
				if (떏(몕)) throw Error();
					if (徣) { if (53 !== 맓) throw Error(); 儋 = 1 }
				const 堐 = new Uint8Array([껿[0], 0]), 憩 = 끄.slice(뉃);
	if (儋) return 뚮(憩, 궍, 堐);
		await 밖(몕, 맓, 憩, 궍, 堐, 幎, 봘);
	}
		}
			},
	close() { 귵() },
			abort() { 귵() }
			})).catch(兽 => { 귵() }), new Response(null, { status: 101, webSocket: 뒍 });
	}(ノ, userID);
		if ("POST" === ノ.method) {
		await 嗠(ノ);
	const 긢 = ノ.headers.get("Referer") || "";
			return 긢.includes("x_padding", 14) || 긢.includes("x_padding=") || !돖.startsWith("application/grpc") ? await async function (兹, 궶) {
			if (!兹.body) return new Response("Bad Request", { status: 400 });
		const 겢 = 兹.body.getReader(), 啿 = await async function (嬈, 大) {
			const 끟 = new TextDecoder, 밾 = Password, 릺 = (new TextEncoder).encode(밾), 듒 = 먰 => {
				const 듇 = 먰.byteLength;
	if (듇 < 18) return { 傆: 0 };
			if (庎(먰.subarray(1, 17)) !== 大) return { 傆: 1 };
		const 뢦 = 18 + 먰[17];
		if (듇 < 뢦 + 1) return { 傆: 0 };
		const ホ = 먰[뢦];
		if (1 !== ホ && 2 !== ホ) return { 傆: 1 };
		const 뼉 = 뢦 + 1;
				if (듇 < 뼉 + 3) return { 傆: 0 };
			const 땙 = 먰[뼉] << 8 | 먰[뼉 + 1], 븣 = 먰[뼉 + 2], 뽛 = 뼉 + 3;
			let 곕 = -1, 廅 = "";
	if (1 === 븣) {
					if (듇 < 뽛 + 4) return { 傆: 0 };
	廅 = `${먰[뽛]}.${먰[뽛 + 1]}.${먰[뽛 + 2]}.${먰[뽛 + 3]}`, 곕 = 뽛 + 4;
					} else if (2 === 븣) {
			if (듇 < 뽛 + 1) return { 傆: 0 };
	const 놎 = 먰[뽛];
				if (듇 < 뽛 + 1 + 놎) return { 傆: 0 };
			廅 = 끟.decode(먰.subarray(뽛 + 1, 뽛 + 1 + 놎)), 곕 = 뽛 + 1 + 놎;
			} else {
				if (3 !== 븣) return { 傆: 1 };
			{
					if (듇 < 뽛 + 16) return { 傆: 0 };
					const 뱅 = [];
			for (let 긖 = 0; 긖 < 8; 긖++) { const 島 = 뽛 + 2 * 긖; 뱅.push((먰[島] << 8 | 먰[島 + 1]).toString(16)) }
			廅 = 뱅.join(":"), 곕 = 뽛 + 16;
			}
				}
			return 廅 ? {
				傆: 2,
				堵: {
			彭: "vless",
			hostname: 廅,
		port: 땙,
			똪: 2 === ホ,
				哻: 먰.subarray(곕),
			堵: new Uint8Array([먰[0], 0])
			}
		} : { 傆: 1 };
			}, 嚞 = 뼺 => {
		const 꺙 = 뼺.byteLength;
			if (꺙 < 58) return { 傆: 0 };
		if (13 !== 뼺[56] || 10 !== 뼺[57]) return { 傆: 1 };
			for (let 닯 = 0; 닯 < 56; 닯++) if (뼺[닯] !== 릺[닯]) return { 傆: 1 };
		if (꺙 < 60) return { 傆: 0 };
	if (1 !== 뼺[58]) return { 傆: 1 };
		const 恖 = 뼺[59];
		let 悼 = 60, 刖 = "";
			if (1 === 恖) {
		if (꺙 < 悼 + 4) return { 傆: 0 };
		刖 = `${뼺[悼]}.${뼺[悼 + 1]}.${뼺[悼 + 2]}.${뼺[悼 + 3]}`, 悼 += 4;
			} else if (3 === 恖) {
		if (꺙 < 悼 + 1) return { 傆: 0 };
						const 凝 = 뼺[悼];
						if (꺙 < 悼 + 1 + 凝) return { 傆: 0 };
				刖 = 끟.decode(뼺.subarray(悼 + 1, 悼 + 1 + 凝)), 悼 += 1 + 凝;
				} else {
					if (4 !== 恖) return { 傆: 1 };
			{
				if (꺙 < 悼 + 16) return { 傆: 0 };
				const 慴 = [];
			for (let 実 = 0; 実 < 8; 実++) { const 啑 = 悼 + 2 * 実; 慴.push((뼺[啑] << 8 | 뼺[啑 + 1]).toString(16)) }
					刖 = 慴.join(":"), 悼 += 16;
		}
		}
					return 刖 ? 꺙 < 悼 + 4 ? { 傆: 0 } : 13 !== 뼺[悼 + 2] || 10 !== 뼺[悼 + 3] ? { 傆: 1 } : {
		傆: 2,
					堵: {
						彭: "trojan",
			hostname: 刖,
				port: 뼺[悼] << 8 | 뼺[悼 + 1],
		똪: 0,
		哻: 뼺.subarray(悼 + 4),
					堵: null
		}
	} : { 傆: 1 };
			};
		let 彩 = new Uint8Array(1024), 끖 = 0;
		for (; ;) {
			const { value: 孳, done: 岜 } = await 嬈.read();
		if (岜) { if (0 === 끖) return null; break }
					const 룳 = 孳 instanceof Uint8Array ? 孳 : new Uint8Array(孳);
		if (끖 + 룳.byteLength > 彩.byteLength) {
				const 娞 = new Uint8Array(Math.max(2 * 彩.byteLength, 끖 + 룳.byteLength));
					娞.set(彩.subarray(0, 끖)), 彩 = 娞;
				}
			彩.set(룳, 끖), 끖 += 룳.byteLength;
		const 嫄 = 彩.subarray(0, 끖), 꼙 = 嚞(嫄);
if (2 === 꼙.傆) return { ...꼙.堵, reader: 嬈 };
				const 冷 = 듒(嫄);
					if (2 === 冷.傆) return { ...冷.堵, reader: 嬈 };
				if (1 === 꼙.傆 && 1 === 冷.傆) return null;
		}
			const 倧 = 彩.subarray(0, 끖), 壍 = 嚞(倧);
					if (2 === 壍.傆) return { ...壍.堵, reader: 嬈 };
				const 냜 = 듒(倧);
		return 2 === 냜.傆 && 냜.堵;
				}(겢, 궶);
		if (!啿) {
				try { 겢.releaseLock() } catch (논) { }
	return new Response("Invalid request", { status: 400 });
			}
			if (떏(啿.hostname)) {
		try { 겢.releaseLock() } catch (독) { }
					return new Response("Forbidden", { status: 403 });
		}
			if (啿.똪 && 53 !== 啿.port) {
		try { 겢.releaseLock() } catch (뒖) { }
				return new Response("UDP is not supported", { status: 400 });
		}
			const 厯 = { 傆: null, 彭: null, 堵: null };
		let 庐 = null, 坩 = null;
		const 唿 = new Headers({
"Content-Type": "application/octet-stream",
		"X-Accel-Buffering": "no",
		"Cache-Control": "no-store"
		}), 둗 = () => {
			if (坩) {
				try { 坩.releaseLock() } catch (갾) { }
		坩 = null;
}
			庐 = null;
	}, 뺹 = () => { const 녨 = 厯.傆; return 녨 ? (녨 !== 庐 && (둗(), 庐 = 녨, 坩 = 녨.writable.getWriter()), 坩) : null };
	return new Response(new ReadableStream({
		async start(븻) {
					let 귭 = 0, 凤 = 啿.堵;
					const 린 = {
				readyState: WebSocket.OPEN,
					send(嬣) {
				if (!귭) try {
				븻.enqueue(function (곪) {
					return 곪 instanceof Uint8Array ? 곪 : 곪 instanceof ArrayBuffer ? new Uint8Array(곪) : ArrayBuffer.isView(곪) ? new Uint8Array(곪.buffer, 곪.byteOffset, 곪.byteLength) : new Uint8Array(곪);
				}(嬣));
			} catch (꽚) { 귭 = 1, this.readyState = WebSocket.CLOSED }
		},
				close() {
			if (!귭) {
						귭 = 1, this.readyState = WebSocket.CLOSED;
					try { 븻.close() } catch (慊) { }
			}
		}
			}, 뱈 = async (后, 岦 = 1) => {
				const 憜 = 뺹();
			if (!憜) return 0;
				try { return await 憜.write(后), 1 } catch (돬) {
					if (둗(), 岦 && "function" == typeof 厯.堵) return await 厯.堵(), await 뱈(后, 0);
throw 돬;
				}
				};
			try {
	for (啿.똪 ? 啿.哻?.byteLength && (await 뚮(啿.哻, 린, 凤), 凤 = null) : await 밖(啿.hostname, 啿.port, 啿.哻, 린, 啿.堵, 厯, 궶); ;) {
				const { done: 抪, value: 댂 } = await 겢.read();
			if (抪) break;
		if (댂 && 0 !== 댂.byteLength) if (啿.똪) await 뚮(댂, 린, 凤), 凤 = null; else if (!await 뱈(댂)) throw Error();
			}
			if (!啿.똪) {
						const 勮 = 뺹();
				if (勮) try { await 勮.close() } catch (姚) { }
			}
				} catch (귉) { 孼(린) } finally {
			둗();
				try { 겢.releaseLock() } catch (墣) { }
		}
			},
		cancel() {
					둗();
					try { 厯.傆?.close() } catch (련) { }
				try { 겢.releaseLock() } catch (볰) { }
				}
		}), { status: 200, headers: 唿 });
}(ノ, userID) : await async function (귬, 몝) {
		if (!귬.body) return new Response("Bad Request", { status: 400 });
			const 尨 = 귬.body.getReader(), 扃 = { 傆: null, 彭: null, 堵: null };
				let 律 = 0, 눿 = null, 怸 = null, 뚉 = null;
			const 夽 = new Headers({
		"Content-Type": "application/grpc",
			"grpc-status": "0",
		"X-Accel-Buffering": "no",
			"Cache-Control": "no-store"
			});
		return new Response(new ReadableStream({
				async start(눵) {
	let 뀴 = 0, 弧 = [], 볳 = 0, 낗 = null;
					const 刢 = {
			readyState: WebSocket.OPEN,
				send(멏) {
					if (뀴) return;
			const 嵽 = 멏 instanceof Uint8Array ? 멏 : new Uint8Array(멏), 懿 = [];
				let 뷯 = 嵽.byteLength >>> 0;
					for (; 뷯 > 127;) 懿.push(127 & 뷯 | 128), 뷯 >>>= 7;
				懿.push(뷯);
					const 叏 = new Uint8Array(懿), 먴 = 1 + 叏.length + 嵽.byteLength, 感 = new Uint8Array(5 + 먴);
					感[0] = 0, 感[1] = 먴 >>> 24 & 255, 感[2] = 먴 >>> 16 & 255, 感[3] = 먴 >>> 8 & 255, 感[4] = 255 & 먴,
				感[5] = 10, 感.set(叏, 6), 感.set(嵽, 6 + 叏.length), 弧.push(感), 볳 += 感.byteLength, 볳 >= 65536 ? 륷() : 낗 || (낗 = setTimeout(륷, 20));
		},
					close() {
				if (this.readyState !== WebSocket.CLOSED) {
				륷(1), 뀴 = 1, this.readyState = WebSocket.CLOSED;
						try { 눵.close() } catch (맙) { }
							}
			}
				}, 륷 = (俏 = 0) => {
					if (낗 && (clearTimeout(낗), 낗 = null), !俏 && 뀴 || 0 === 볳) return;
				const 몊 = new Uint8Array(볳);
					let 抾 = 0;
			for (const 差 of 弧) 몊.set(差, 抾), 抾 += 差.byteLength;
						弧 = [], 볳 = 0;
					try { 눵.enqueue(몊) } catch (拝) { 뀴 = 1, 刢.readyState = WebSocket.CLOSED }
	}, 披 = () => {
		if (뚉) {
			try { 뚉.releaseLock() } catch (랝) { }
	뚉 = null;
				}
	怸 = null;
			}, 廯 = async (哩, 寴 = 1) => {
				const 呥 = 扃.傆;
		if (!呥) return 0;
					呥 !== 怸 && (披(), 怸 = 呥, 뚉 = 呥.writable.getWriter());
						try { return await 뚉.write(哩), 1 } catch (做) {
				if (披(), 寴 && "function" == typeof 扃.堵) return await 扃.堵(), await 廯(哩, 0);
				throw 做;
			}
			};
			try {
		let 吙 = new Uint8Array(0);
					for (; ;) {
			const { done: 埓, value: 뜕 } = await 尨.read();
				if (埓) break;
				if (!뜕 || 0 === 뜕.byteLength) continue;
						const 믣 = 뜕 instanceof Uint8Array ? 뜕 : new Uint8Array(뜕), 屧 = new Uint8Array(吙.length + 믣.length);
				for (屧.set(吙, 0), 屧.set(믣, 吙.length), 吙 = 屧; 吙.byteLength >= 5;) {
				const 峒 = 5 + (吙[1] << 24 >>> 0 | 吙[2] << 16 | 吙[3] << 8 | 吙[4]);
				if (吙.byteLength < 峒) break;
				const 引 = 吙.slice(5, 峒);
						if (吙 = 吙.slice(峒), !引.byteLength) continue;
			let 뢾 = 引;
			if (뢾.byteLength >= 2 && 10 === 뢾[0]) {
						let 囸 = 0, 븁 = 1, 凯 = 0;
			for (; 븁 < 뢾.length;) {
					if (!(128 & 뢾[븁++])) { 凯 = 1; break }
						if (囸 += 7, 囸 > 35) break;
				}
		凯 && (뢾 = 뢾.slice(븁));
					}
					if (뢾.byteLength) if (律) await 뚮(뢾, 刢, null); else if (扃.傆) { if (!await 廯(뢾)) throw Error() } else {
					let 廾;
					廾 = 뢾 instanceof ArrayBuffer ? 뢾 : ArrayBuffer.isView(뢾) ? 뢾.buffer.slice(뢾.byteOffset, 뢾.byteOffset + 뢾.byteLength) : new Uint8Array(뢾).buffer;
				const 낄 = new Uint8Array(廾);
								if (null === 눿 && (눿 = 낄.byteLength >= 58 && 13 === 낄[56] && 10 === 낄[57]), 눿) {
				const 럘 = 듊(廾);
						if (럘?.徬) throw Error();
					const { port: 깨, hostname: 꿀, 붐: 꼪 } = 럘;
						if (떏(꿀)) throw Error();
						await 밖(꿀, 깨, 꼪, 刢, null, 扃, 몝);
					} else {
					const 눽 = 垶(廾, 몝);
					if (눽?.徬) throw Error();
						const { port: 儫, hostname: 嶧, 뻳: 덾, 戵: 嗈, 똪: 벺 } = 눽;
						if (떏(嶧)) throw Error();
						if (벺) { if (53 !== 儫) throw Error(); 律 = 1 }
			const 뎎 = new Uint8Array([嗈[0], 0]);
						刢.send(뎎);
					const 嬏 = 廾.slice(덾);
					律 ? await 뚮(嬏, 刢, null) : await 밖(嶧, 儫, 嬏, 刢, null, 扃, 몝);
						}
				}
			}
			륷();
				}
	} catch (뼝) { } finally {
		披(), (() => {
					if (!뀴) {
				if (륷(1), 뀴 = 1, 刢.readyState = WebSocket.CLOSED, 낗 && clearTimeout(낗), 뚉) {
							try { 뚉.releaseLock() } catch (공) { }
				뚉 = null;
			}
						怸 = null;
						try { 尨.releaseLock() } catch (惟) { }
					try { 扃.傆?.close() } catch (뽒) { }
					try { 눵.close() } catch (뱨) { }
				}
				})();
				}
			},
			cancel() {
			try { 扃.傆?.close() } catch (愎) { }
		try { 尨.releaseLock() } catch (끪) { }
				}
				}), { status: 200, headers: 夽 });
	}(ノ, userID);
	}
		return new Response("Hello World!");
	}
};
function 럲(뗨) { return 뗨?.byteLength ?? 뗨?.length ?? 0 }
function 듊(뉸) {
	const 뮿 = Password;
	if (뉸.byteLength < 56) return { 徬: 1 };
	if (13 !== new Uint8Array(뉸.slice(56, 57))[0] || 10 !== new Uint8Array(뉸.slice(57, 58))[0]) return { 徬: 1 };
if ((new TextDecoder).decode(뉸.slice(0, 56)) !== 뮿) return { 徬: 1 };
	const 恫 = 뉸.slice(58);
if (恫.byteLength < 6) return { 徬: 1 };
	const 嶐 = new DataView(恫);
	if (1 !== 嶐.getUint8(0)) return { 徬: 1 };
let 느 = 0, 奂 = 2, 悜 = "";
switch (嶐.getUint8(1)) {
case 1:
	느 = 4, 悜 = new Uint8Array(恫.slice(奂, 奂 + 느)).join(".");
	break;
	case 3:
		느 = new Uint8Array(恫.slice(奂, 奂 + 1))[0], 奂 += 1, 悜 = (new TextDecoder).decode(恫.slice(奂, 奂 + 느));
			break;
	case 4:
	느 = 16;
			const 厞 = new DataView(恫.slice(奂, 奂 + 느)), 뙑 = [];
for (let 兗 = 0; 兗 < 8; 兗++) 뙑.push(厞.getUint16(2 * 兗).toString(16));
		悜 = 뙑.join(":");
break;
		default:
	return { 徬: 1 };
	}
	if (!悜) return { 徬: 1 };
const 밈 = 奂 + 느, 뙦 = 恫.slice(밈, 밈 + 2);
	return {
	徬: 0,
	port: new DataView(뙦).getUint16(0),
		hostname: 悜,
	붐: 恫.slice(밈 + 4)
	};
}
function 垶(바, 뽄) {
	if (바.byteLength < 24) return { 徬: 1 };
const 匤 = new Uint8Array(바.slice(0, 1));
	if (庎(new Uint8Array(바.slice(1, 17))) !== 뽄) return { 徬: 1 };
	const 녘 = new Uint8Array(바.slice(17, 18))[0], 륖 = new Uint8Array(바.slice(18 + 녘, 19 + 녘))[0];
let 뙴 = 0;
	if (1 !== 륖) {
		if (2 !== 륖) return { 徬: 1 };
	뙴 = 1;
}
	const 꺲 = 19 + 녘, 岈 = new DataView(바.slice(꺲, 꺲 + 2)).getUint16(0);
let 븘 = 꺲 + 2, 꺸 = 0, 룜 = 븘 + 1, 겳 = "";
	switch (new Uint8Array(바.slice(븘, 룜))[0]) {
	case 1:
			꺸 = 4, 겳 = new Uint8Array(바.slice(룜, 룜 + 꺸)).join(".");
	break;
	case 2:
			꺸 = new Uint8Array(바.slice(룜, 룜 + 1))[0], 룜 += 1, 겳 = (new TextDecoder).decode(바.slice(룜, 룜 + 꺸));
		break;
	case 3:
	꺸 = 16;
	const 倖 = [], 덋 = new DataView(바.slice(룜, 룜 + 꺸));
		for (let 놕 = 0; 놕 < 8; 놕++) 倖.push(덋.getUint16(2 * 놕).toString(16));
		겳 = 倖.join(":");
			break;
		default:
			return { 徬: 1 };
	}
	return 겳 ? {
	徬: 0,
		port: 岈,
		hostname: 겳,
똪: 뙴,
		뻳: 룜 + 꺸,
	戵: 匤
	} : { 徬: 1 };
}
async function 밖(嚑, 긮, 傓, 傊, 괡, 괣, 듣) {
	let 먻 = 0;
	async function 奞(憽, 堡 = 1e3) {
	await Promise.race([憽.opened, new Promise((嫉, 憴) => setTimeout(() => 憴(Error()), 堡))]);
}
	async function 븲(哚, ク, 垳 = null, 댒 = null, 룺 = 1) {
	let 増;
if (댒 && 댒.length > 0) for (let 뙽 = 0; 뙽 < 댒.length; 뙽++) {
	const 圪 = (맀 + 뙽) % 댒.length, [뜢, 뼏] = 댒[圪];
		try {
		if (増 = 嗋({ hostname: 뜢, port: 뼏 }), await 奞(増), 럲(垳) > 0) {
			const 뜝 = 増.writable.getWriter();
	await 뜝.write(垳), 뜝.releaseLock();
}
		return 맀 = 圪, 増;
		} catch (볲) {
		try { 増?.close?.() } catch (僭) { }
				continue;
		}
	}
		if (룺) {
		if (増 = 嗋({ hostname: 哚, port: ク }), await 奞(増), 럲(垳) > 0) {
			const 돦 = 増.writable.getWriter();
			await 돦.write(垳), 돦.releaseLock();
			}
	return 増;
	}
throw 孼(傊), Error();
	}
async function 몖(抯 = 1) {
		if (괣.彭) return void await 괣.彭;
	const 뢺 = 抯 && !먻 && 럲(傓) > 0, 뱟 = 뢺 ? 傓 : null, 噄 = (async () => {
		let 꺓;
		if ("socks5" === 婌) 꺓 = await async function (뮲, カ, 媽) {
			const { username: 꿫, password: 廊, hostname: 倚, port: 닡 } = 慡, 判 = 嗋({
		hostname: 倚,
	port: 닡
	}), 곝 = 判.writable.getWriter(), 뽗 = 判.readable.getReader();
		try {
			const 땒 = 꿫 && 廊 ? new Uint8Array([5, 2, 0, 2]) : new Uint8Array([5, 1, 0]);
	await 곝.write(땒);
		let 뉎 = await 뽗.read();
			if (뉎.done || 뉎.value.byteLength < 2) throw Error();
			const 恽 = new Uint8Array(뉎.value)[1];
			if (2 === 恽) {
				if (!꿫 || !廊) throw Error();
			const 奫 = (new TextEncoder).encode(꿫), 剘 = (new TextEncoder).encode(廊), 嘼 = new Uint8Array([1, 奫.length, ...奫, 剘.length, ...剘]);
		if (await 곝.write(嘼), 뉎 = await 뽗.read(), 뉎.done || 0 !== new Uint8Array(뉎.value)[1]) throw Error();
			} else if (0 !== 恽) throw Error();
				const 겏 = (new TextEncoder).encode(뮲), 嚟 = new Uint8Array([5, 1, 0, 3, 겏.length, ...겏, カ >> 8, 255 & カ]);
			if (await 곝.write(嚟), 뉎 = await 뽗.read(), 뉎.done || 0 !== new Uint8Array(뉎.value)[1]) throw Error();
	return 럲(媽) > 0 && await 곝.write(媽), 곝.releaseLock(), 뽗.releaseLock(), 判;
	} catch (冄) {
	try { 곝.releaseLock() } catch (녹) { }
				try { 뽗.releaseLock() } catch (彡) { }
				try { 判.close() } catch (걱) { }
				throw 冄;
		}
	}(嚑, 긮, 뱟); else if ("http" === 婌 || "https" === 婌) 꺓 = await async function (庅, 궉, 뱲) {
	const { username: 垽, password: 墚, hostname: 唟, port: 存 } = 慡, 눃 = 嗋({
			hostname: 唟,
	port: 存
		}), 롱 = 눃.writable.getWriter(), 멉 = 눃.readable.getReader();
		try {
				const 尕 = `CONNECT ${庅}:${궉} HTTP/1.1\r\nHost: ${庅}:${궉}\r\n${垽 && 墚 ? `Proxy-Authorization: Basic ${btoa(`${垽}:${墚}`)}\r\n` : ""}User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n`;
		await 롱.write((new TextEncoder).encode(尕));
		let 弫 = new Uint8Array(0), 걪 = -1, 叁 = 0;
			for (; -1 === 걪 && 叁 < 8192;) {
		const { done: 幮, value: 뤐 } = await 멉.read();
			if (幮) throw Error();
	弫 = new Uint8Array([...弫, ...뤐]), 叁 = 弫.length;
				const 冽 = 弫.findIndex((겚, 껆) => 껆 < 弫.length - 3 && 13 === 弫[껆] && 10 === 弫[껆 + 1] && 13 === 弫[껆 + 2] && 10 === 弫[껆 + 3]);
			-1 !== 冽 && (걪 = 冽 + 4);
		}
		if (-1 === 걪) throw Error();
		const 嵤 = parseInt((new TextDecoder).decode(弫.slice(0, 걪)).split("\r\n")[0].match(/HTTP\/\d\.\d\s+(\d+)/)[1]);
				if (嵤 < 200 || 嵤 >= 300) throw Error();
				return 럲(뱲) > 0 && await 롱.write(뱲), 롱.releaseLock(), 멉.releaseLock(), 눃;
			} catch (憑) {
	try { 롱.releaseLock() } catch (俌) { }
	try { 멉.releaseLock() } catch (걫) { }
			try { 눃.close() } catch (勴) { }
			throw 憑;
	}
		}(嚑, 긮, 뱟); else {
			const 庯 = await async function (匚, 듾 = "dash.cloudflare.com", 괍 = "00000000-0000-4000-8000-000000000000") {
	if (!憠 || !낞 || 憠 !== 匚) {
			function 뚄(壞) {
			let 늼 = 壞, 悏 = 443;
				if (壞.includes("]:")) {
			const 떎 = 壞.split("]:");
					늼 = 떎[0] + "]", 悏 = parseInt(떎[1], 10) || 悏;
				} else if (壞.includes(":") && !壞.startsWith("[")) {
							const 갑 = 壞.lastIndexOf(":");
				늼 = 壞.slice(0, 갑), 悏 = parseInt(壞.slice(갑 + 1), 10) || 悏;
		}
			return [늼, 悏];
			}
	匚 = 匚.toLowerCase();
			const 卝 = await async function (뵟) {
			var 둀 = 뵟.replace(/[	"'\r\n]+/g, ",").replace(/,+/g, ",");
					return "," == 둀.charAt(0) && (둀 = 둀.slice(1)), "," == 둀.charAt(둀.length - 1) && (둀 = 둀.slice(0, 둀.length - 1)),
				둀.split(",");
			}(匚);
		let 扪 = [];
		for (const 떔 of 卝) {
				let [嬴, 嗨] = 뚄(떔);
					if (떔.includes(".tp")) { const 륓 = 떔.match(/\.tp(\d+)/); 륓 && (嗨 = parseInt(륓[1], 10)) }
				扪.push([嬴, 嗨]);
				}
					const 姎 = 扪.sort((띻, 땗) => 띻[0].localeCompare(땗[0]));
			let 塦 = [...(듾.includes(".") ? 듾.split(".").slice(-2).join(".") : 듾) + 괍].reduce((兜, 抺) => 兜 + 抺.charCodeAt(0), 0);
const 꿦 = [...姎].sort(() => (塦 = 1103515245 * 塦 + 12345 & 2147483647) / 2147483647 - .5);
				낞 = 꿦.slice(0, 8), 憠 = 匚;
		}
					return 낞;
	}(뎚, 嚑, 듣);
꺓 = await 븲("p\u0072o\u0078\u0079\u0069p\u002ec\u004d\u004c\u0069\u0055\u0073sss\u002eN\u0045T", 1, 뱟, 庯, 뷚);
	}
	뢺 && (먻 = 1), 괣.傆 = 꺓, 꺓.closed.catch(() => { }).finally(() => 孼(傊)), 돓(꺓, 傊, 괡, null);
})();
괣.彭 = 噄;
	try { await 噄 } finally { 괣.彭 === 噄 && (괣.彭 = null) }
	}
	if (괣.堵 = async () => 몖(먻 ? 0 : 1), 婌 && (噸 || (慒 = 嚑, 똳.some(戺 => new RegExp(`^${戺.replace(/\*/g, ".*")}$`, "i").test(慒))))) try {
await 몖();
} catch (呻) { throw 呻 } else try {
const 俚 = await 븲(嚑, 긮, 傓);
괣.傆 = 俚, 돓(俚, 傊, 괡, async () => { 괣.傆 === 俚 && await 몖() });
} catch (뛂) { await 몖() }
var 慒;
}
async function 뚮(뭎, 幩, 僈) {
	try {
	const 兓 = 嗋({ hostname: "8.8.4.4", port: 53 });
	let 埮 = 僈;
		const 맿 = 兓.writable.getWriter();
	await 맿.write(뭎), 맿.releaseLock(), await 兓.readable.pipeTo(new WritableStream({
		async write(빳) {
				if (幩.readyState === WebSocket.OPEN) if (埮) {
		const 原 = new Uint8Array(埮.length + 빳.byteLength);
		原.set(埮, 0), 原.set(빳, 埮.length), 幩.send(原.buffer), 埮 = null;
} else 幩.send(빳);
}
}));
} catch (딠) { }
}
function 孼(峽) {
try { 峽.readyState > 0 && 峽.readyState < 3 && 峽.close() } catch { }
}
function 庎(묽, 廚 = 0) {
	const 埿 = [...묽.slice(廚, 廚 + 16)].map(끹 => 끹.toString(16).padStart(2, "0")).join("");
	return `${埿.substring(0, 8)}-${埿.substring(8, 12)}-${埿.substring(12, 16)}-${埿.substring(16, 20)}-${埿.substring(20)}`;
}
async function 돓(굺, 寠, 嗥, 徽) {
let 坳 = 嗥, 놞 = 0;
	await 굺.readable.pipeTo(new WritableStream({
		async write(僙, 롧) {
	if (놞 = 1, 寠.readyState !== WebSocket.OPEN && 롧.error("ws.readyState is not open"),
			坳) {
			const 뫐 = new Uint8Array(坳.length + 僙.byteLength);
		뫐.set(坳, 0), 뫐.set(僙, 坳.length), 寠.send(뫐.buffer), 坳 = null;
			} else 寠.send(僙);
	}
	})).catch(傏 => { 孼(寠) }), !놞 && 徽 && await 徽();
}
function 떏(扱) { return "speed.cloudflare.com" === 扱 || 扱.endsWith(".speed.cloudflare.com") }
import { connect as 嗋 } from "\u0063\u006co\u0075\u0064fla\u0072e:s\u006f\u0063\u006b\u0065ts";
async function 嗠(꼕) {
const 넀 = new URL(꼕.url), { searchParams: 嗎 } = 넀, 돕 = decodeURIComponent(넀.pathname), 分 = 돕.toLowerCase();
	뗠 = 嗎.get("socks5") || 嗎.get("http") || null, 噸 = 嗎.has("globalproxy") ? 1 : 0;
const 믠 = (멵, 十 = 1) => {
const 밶 = /^(socks5|http):\/\/(.+)$/i.exec(멵 || "");
	return 밶 ? (婌 = 밶[1].toLowerCase(), 뗠 = 밶[2].split("/")[0], 十 && (噸 = 1), 1) : 0;
}, 뗽 = 弻 => { 뎚 = 弻, 뷚 = 0 }, 뻢 = 嗎.get("proxyip");
	if (null !== 뻢) { if (!믠(뻢)) return 뗽(뻢) } else {
let 弚 = /\/(socks5?|http):\/?\/?([^/?#\s]+)/i.exec(돕);
		if (弚) 婌 = "http" === 弚[1].toLowerCase() ? "http" : "socks5", 뗠 = 弚[2].split("/")[0],
噸 = 1; else if (弚 = /\/(g?s5|socks5|g?http)=([^/?#\s]+)/i.exec(돕)) {
			const 塈 = 弚[1].toLowerCase();
				뗠 = 弚[2].split("/")[0], 婌 = 塈.includes("http") ? "http" : "socks5", 塈.startsWith("g") && (噸 = 1);
	} else if (弚 = /\/(proxyip[.=]|pyip=|ip=)([^?#\s]+)/.exec(分)) {
			const 녊 = (꽽 => {
				if (!꽽.includes("://")) { const 寉 = 꽽.indexOf("/"); return 寉 > 0 ? 꽽.slice(0, 寉) : 꽽 }
		const 듂 = 꽽.split("://");
			if (2 !== 듂.length) return 꽽;
	const 근 = 듂[1].indexOf("/");
			return 근 > 0 ? `${듂[0]}://${듂[1].slice(0, 근)}` : 꽽;
		})(弚[2]);
	if (!믠(녊)) return 뗽(녊);
			}
}
if (뗠) try {
慡 = await function (唫) {
		const 嘪 = 唫.lastIndexOf("@");
	if (-1 !== 嘪) {
				let 凳 = 唫.slice(0, 嘪).replaceAll("%3D", "=");
!凳.includes(":") && 똔.test(凳) && (凳 = atob(凳)), 唫 = `${凳}@${唫.slice(嘪 + 1)}`;
	}
const 戧 = 唫.lastIndexOf("@"), 堰 = -1 === 戧 ? 唫 : 唫.slice(戧 + 1), 랴 = -1 === 戧 ? "" : 唫.slice(0, 戧), [愜, 땲] = 랴 ? 랴.split(":") : [];
		if (랴 && !땲) throw Error();
	let 拄 = 堰, 곭 = 80;
	if (堰.includes("]:")) {
			const [孇, 哘 = ""] = 堰.split("]:");
	拄 = 孇 + "]", 곭 = Number(哘.replace(/[^\d]/g, ""));
			} else if (!堰.startsWith("[")) {
				const 녭 = 堰.split(":");
			2 === 녭.length && (拄 = 녭[0], 곭 = Number(녭[1].replace(/[^\d]/g, "")));
		}
		if (isNaN(곭)) throw Error();
if (拄.includes(":") && !걢.test(拄)) throw Error();
		return {
username: 愜,
		password: 땲,
		hostname: 拄,
	port: 곭
		};
		}(뗠), 婌 = 嗎.get("http") ? "http" : 婌 || "socks5";
} catch (愅) { 婌 = null } else 婌 = null;
}
const 똔 = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i, 걢 = /^\[.*\]$/;
