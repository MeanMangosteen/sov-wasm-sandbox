/** @type {import('next').NextConfig} */
import { access, symlink } from "fs/promises";
import { join } from "path";

const nextConfig = () => {
  const config = {
    webpack(config, { isServer }) {
      // Enable WebAssembly
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };

      // Add WebAssembly MIME type to asset loader
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });

      config.plugins.push(
        new (class {
          apply(compiler) {
            compiler.hooks.afterEmit.tapPromise(
              "SymlinkWebpackPlugin",
              async (compiler) => {
                if (isServer) {
                  const from = join(compiler.options.output.path, "../static");
                  const to = join(compiler.options.output.path, "static");

                  try {
                    await access(from);
                    return;
                  } catch (error) {
                    if (error.code === "ENOENT") {
                    } else {
                      throw error;
                    }
                  }
                  await symlink(to, from, "junction");
                }
              }
            );
          }
        })()
      );

      // if (isServer) {
      //   config.output.webassemblyModuleFilename =
      //     "./../static/wasm/[modulehash].wasm";
      // } else {
      //   config.output.webassemblyModuleFilename =
      //     "static/wasm/[modulehash].wasm";
      // }

      return config;
    },
    eslint: {
      // I don't want to do this, but lint error in auto-gen src/API.ts
      // TODO: find a way to enable this.
      ignoreDuringBuilds: true,
    },
  };

  return config;
};

export default nextConfig;
