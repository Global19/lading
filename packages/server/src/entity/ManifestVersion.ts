import { Maximum, MaxLength, Minimum, Property, Required } from "@tsed/schema";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Manifest } from "./Manifest";
import { PackageVersion } from "./PackageVersion";

@Entity()
export class ManifestVersion {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @ManyToOne(
    () => PackageVersion,
    (packageVersion) => packageVersion.manifestVersions
  )
  packageVersion: PackageVersion;

  @ManyToOne(() => Manifest, (manifest) => manifest.manifestVersions)
  manifest: Manifest;
  
  get packageName(): string | undefined {
    return this.packageVersion?.packageName;
  }

  get payload(): any {
    if (this.packageVersion && this.packageVersion.package) {
      return {
        package: this.packageVersion?.packageName,
        version: this.packageVersion?.version,
        url: this.packageVersion?.cdnUrl,
      };
    }
  }

  get humanFriendlyName(): string {
    return (
      this.packageVersion?.package?.humanFriendlyName || "(err not loaded)"
    );
  }

  get humanFriendlyVersion(): string {
    return this.packageVersion?.version || "(err not loaded)";
  }
}